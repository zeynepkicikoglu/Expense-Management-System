import express from "express";
import {
  getExpenses,
  getExpenseCodes,
  getCustomers,
  createExpense,
} from "../controllers/expense.controller.js";
//import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Masraf listesini al
router.get("/expenses", getExpenses);

// Masraf kodlarını al
router.get("/expense-codes", getExpenseCodes);

// Müşterileri al
router.get("/customers", getCustomers);

// Masraf ekle
router.post("/create-expense", createExpense);

export default router;
