//(MongoDB bağlantı ayarları)
import mongoose from "mongoose";

const conn = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Expense_Management",
    })
    .then(() => {
      console.log("DB ye bağlantı başarılı.");
    })
    .catch((err) => {
      console.log(`DB connection err: ${err}`);
    });
};

export default conn;
