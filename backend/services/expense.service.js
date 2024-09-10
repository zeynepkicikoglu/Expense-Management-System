import axios from "axios";
import Expense from "../models/expense.js";
import { Customer, CustPers } from "../models/customer.model.js";
import { getGlobalPersonId } from "../utils/global.js";

const serviceUrl =
  "https://pame8xi-dev1.build.ifs.cloud/int/ifsapplications/projection/v1/NextZeyService.svc";

export const getExpenses = async (personId, year, period, headers) => {
  console.log("get expenses hitted.");
  try {
    console.log("person id: ", personId);

    // Headers'ı kontrol edelim

    console.log("Headers:", headers);

    // Headers'ın doğru ayarlandığından emin olalım
    if (!headers || !headers.Authorization) {
      throw new Error("Authorization header is missing.");
    }

    const response = await axios.get(
      `${serviceUrl}/GetExpenses(PersonId='${personId}',Year=${year},Period=${period})`,
      { headers } // Doğru bir şekilde headers parametresi ayarlandı
    );
    return response.data.value;
  } catch (error) {
    console.error("Error fetching expenses", error);
    throw error;
  }
};

export const getCustomers = async (headers) => {
  console.log("getCustomers services hitted.");

  try {
    // Authorization headers'ı kontrol edin
    console.log("Headers:", headers);
    if (!headers || !headers.Authorization) {
      throw new Error("Authorization header is missing.");
    }

    // Global olarak saklanan personId'yi alın
    const personId = getGlobalPersonId();
    if (!personId) {
      throw new Error("Person ID not found.");
    }

    // CustPers tablosundan ilgili CustomerId'leri çek
    const custPersEntries = await CustPers.find({ PersonId: personId });
    if (!custPersEntries.length) {
      throw new Error("No related customers found for this person.");
    }

    // İlgili müşteri ID'lerini toplayın
    const customerIds = custPersEntries.map((entry) => entry.CustomerId);

    // Müşteri verilerini önce IFS API'den çekmeye çalışın
    try {
      const response = await axios.get(`${serviceUrl}/RRReference_Customers`, {
        headers,
      });

      // IFS API'den dönen veriyi kontrol edin
      //const ifsCustomers = response.data.value;
      const ifsCustomers = response.data.value || [];

      if (
        !ifsCustomers ||
        !Array.isArray(ifsCustomers) ||
        ifsCustomers.length === 0
      ) {
        throw new Error("Invalid or empty response from IFS API.");
      }

      console.log("IFS Response:", ifsCustomers);

      return ifsCustomers;
    } catch (ifsError) {
      console.error("Error fetching customers from IFS", ifsError.message);

      // IFS API'den veri çekilemezse MongoDB'den müşteri verilerini çek
      const customersFromDb = await Customer.find({
        CustomerId: { $in: customerIds },
      });
      console.log("Fetched customers from MongoDB:", customersFromDb);

      return customersFromDb;
    }
  } catch (error) {
    console.error("Error fetching customers from service", error.message);
    throw error;
  }
};

export const getExpenseCodes = async (headers) => {
  console.log("getExpenseCodes services hitted.");

  try {
    // Headers'ı kontrol edelim

    console.log("Headers:", headers);

    // Headers'ın doğru ayarlandığından emin olalım
    if (!headers || !headers.Authorization) {
      throw new Error("Authorization header is missing.");
    }
    const response = await axios.get(`${serviceUrl}/Reference_ExpenseCodes`, {
      headers,
    });
    console.log("response", response);
    console.log("response.data: ", response.data);

    return response.data.value;
  } catch (error) {
    console.error("Error fetching expense codes", error);
    throw error;
  }
};

export const createExpense = async (requestData, headers) => {
  console.log("create expense basındayımmm");
  const serviceUrl =
    "https://pame8xi-dev1.build.ifs.cloud/int/ifsapplications/projection/v1/NextZeyService.svc/CreateExpense";
  try {
    const response = await axios.post(serviceUrl, requestData, {
      headers,
      "Content-Type": "application/json",
    });
    console.log("IFS Response:", response.data);

    const { ExpenseId } = response.data;

    if (ExpenseId) {
      // Veritabanında ExpenseId ile güncelleme yap
      const updateResult = await Expense.findOneAndUpdate(
        { ExpenseId: requestData.ExpenseId }, // Mevcut ExpenseId'yi kullanarak güncelle
        {
          ...requestData, // requestData'nın tamamını güncelle
          ExpenseId, // Yeni ExpenseId'yi güncelle
        },
        { new: true, upsert: true } // Kayıt yoksa ekle
      );

      console.log("Updated Expense:", updateResult);
    }

    return response.data;
  } catch (error) {
    console.error(
      "IFS Request Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
