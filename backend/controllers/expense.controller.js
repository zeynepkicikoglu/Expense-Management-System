import * as ExpenseListService from "../services/expense.service.js";
import { Customer } from "../models/customer.model.js";
import { CustPers } from "../models/customer.model.js";
import { getGlobalPersonId } from "../utils/global.js";

export const getExpenseCodes = async (req, res) => {
  console.log("getExpenseCodes controlun basındayımmm");

  // Authorization headers'ı alın
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(400)
      .json({ message: "Authorization header is missing." });
  }
  try {
    const codes = await ExpenseListService.getExpenseCodes({
      Authorization: authHeader,
    });
    if (codes && codes.length > 0) {
      console.log("FRONTENDE GİTTİ", codes);
      res.json({
        success: true,
        codes: codes,
      });
    } else {
      console.log("FRONTENDE GİDEMEDİ, codes bulunamadı");
      res.status(404).json({ success: false, message: "codes not found" });
    }
  } catch (error) {
    console.error("codes fetch hatası:", error);
    res.status(500).json({ success: false, message: "Error codes expenses" });
  } finally {
    console.log("Codes request tamamlandı.");
  }
};

// export const getCustomers = async (req, res) => {
//   console.log("getCustomers controlun basındayımmm");
//   // Authorization headers'ı alın
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res
//       .status(400)
//       .json({ message: "Authorization header is missing." });
//   }

//   try {
//     const customers = await ExpenseListService.getCustomers({
//       Authorization: authHeader,
//     });
//     if (customers && customers.length > 0) {
//       console.log("FRONTENDE GİTTİ", customers);
//       res.json({
//         success: true,
//         customers: customers,
//       });
//     } else {
//       console.log("FRONTENDE GİDEMEDİ, customers bulunamadı");
//       res.status(404).json({ success: false, message: "customers not found" });
//     }
//   } catch (error) {
//     console.error("customers fetch hatası:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error customers expenses" });
//   } finally {
//     console.log("Customers request tamamlandı.");
//   }
// };

export const getCustomers = async (req, res) => {
  console.log("getCustomers controllunun başındayım");

  // Authorization headers'ı alın
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(400)
      .json({ message: "Authorization header is missing." });
  }

  try {
    // Global olarak saklanan personId'yi alın
    const personId = getGlobalPersonId();

    if (!personId) {
      return res.status(400).json({ message: "Person ID not found." });
    }

    // CustPers tablosundan ilgili CustomerId'leri çek
    const custPersEntries = await CustPers.find({ PersonId: personId });

    if (!custPersEntries.length) {
      return res
        .status(404)
        .json({ message: "No related customers found for this person." });
    }

    // Customer tablosundan ilgili müşteri bilgilerini çek
    const customerIds = custPersEntries.map((entry) => entry.CustomerId);
    const customers = await Customer.find({ CustomerId: { $in: customerIds } });

    if (customers.length > 0) {
      console.log("FRONTENDE GİTTİ", customers);
      res.json({
        success: true,
        customers: customers,
      });
    } else {
      console.log("FRONTENDE GİDEMEDİ, customers bulunamadı");
      res.status(404).json({ success: false, message: "Customers not found" });
    }
  } catch (error) {
    console.error("customers fetch hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching customers." });
  } finally {
    console.log("Customers request tamamlandı.");
  }
};

export const getExpenses = async (req, res) => {
  console.log("expense controlun basındayımmm");

  // Query parametrelerini al
  const year = req.query.year;
  const period = req.query.period;
  const personId = req.query.personId;

  // Authorization headers'ı alın
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(400)
      .json({ message: "Authorization header is missing." });
  }

  console.log("Req Query: ", req.query);
  console.log("Req period and year: ", year, period);
  console.log("person id: ", personId);
  console.log("Authorization header: ", authHeader);

  try {
    console.log("expense list service gidiyorummm", year);

    const expenses = await ExpenseListService.getExpenses(
      personId,
      year,
      period,
      { Authorization: authHeader } // Headers'ı doğru şekilde gönder
    );
    if (expenses && expenses.length > 0) {
      console.log("FRONTENDE GİTTİ", expenses);
      res.json({
        success: true,
        expenses: expenses,
      });
    } else {
      console.log("FRONTENDE GİDEMEDİ, Expense bulunamadı");
      res.status(404).json({ success: false, message: "Expenses not found" });
    }
  } catch (error) {
    console.error("Expense fetch hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching expenses" });
  } finally {
    console.log("Expense request tamamlandı.");
  }
};

export const createExpense = async (req, res) => {
  console.log("createExpense başındayımmmm", req);

  // Authorization headers'ı alın
  const authHeader = req.headers.authorization;
  const headers = { Authorization: authHeader };
  console.log("Authorization Header:", authHeader);
  console.log("Request data sent to IFS:", req.body);
  console.log("Headers sent to IFS:", headers);

  const requestData = req.body;

  if (!authHeader) {
    return res
      .status(400)
      .json({ message: "Authorization header is missing." });
  }

  try {
    // IFS servisine yönlendiriyoruz
    const result = await ExpenseListService.createExpense(requestData, headers); // headers burada kullanılıyor
    res.json(result);
  } catch (error) {
    console.error("Error creating expense in IFS service:", error);
    res.status(500).json({ message: "Error creating expense" });
  }
};
