import mongoose from "mongoose";

// Müşteriler için schema tanımı
const customerSchema = new mongoose.Schema({
  CustomerId: { type: String, required: true },
  Name: { type: String, required: true },
});

// CustPers için schema tanımı
const custPersSchema = new mongoose.Schema({
  CustomerId: { type: String, required: true },
  PersonId: { type: String, required: true },
});

// Modelleri tanımlama
const Customer = mongoose.model("Customer", customerSchema, "Customer");
const CustPers = mongoose.model("CustPers", custPersSchema, "CustPers");

export { Customer, CustPers };
