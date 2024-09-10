const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenInfoSchema = new Schema({
  access_token: { type: String, required: true },
  expires_in: { type: Number, required: true },
  refresh_expires_in: { type: Number, required: true },
  refresh_token: { type: String, required: true },
  token_type: { type: String, required: true },
});

const PersonSchema = new Schema({
  Id: { type: String, required: true },
  Name: { type: String, required: true },
});

module.exports = {
  TokenInfo: mongoose.model("TokenInfo", TokenInfoSchema),
  Person: mongoose.model("Person", PersonSchema),
};
