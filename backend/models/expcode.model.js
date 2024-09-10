const mongoose = require("mongoose");

const loginResultSchema = new mongoose.Schema({
  Success: { type: Boolean, required: true },
  ErrorMessage: { type: String, required: true },
  Name: { type: String, required: true },
});

const LoginResult = mongoose.model("LoginResult", loginResultSchema);

module.exports = {
  LoginResult,
};

// Harcama Kodları
const nextGenExpenseCodesSchema = new mongoose.Schema({
  //luname: { type: String, required: true },
  ExpenseCode: { type: String, required: true },
  Description: { type: String, required: true },
});
