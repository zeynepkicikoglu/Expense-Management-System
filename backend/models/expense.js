import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  ExpenseId: { type: Number, required: true },
  CustomerId: { type: String, required: true },
  CustomerName: { type: String, default: null },
  ExpenseCode: { type: String, required: true },
  ExpenseCodeDesc: { type: String, default: null },
  ExpenseDate: { type: String, required: true },
  Description: { type: String, required: true },
  ExpenseType: { type: String, required: true },
  DocumentNo: { type: String, required: true },
  Amount: { type: Number, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
