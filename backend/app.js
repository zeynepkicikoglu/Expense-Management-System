import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conn from "./config/db.js";
import signInRoutes from "./routes/sign-in.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import bodyParser from "body-parser";

dotenv.config();

// Veritabanı bağlantısını başlat
conn();

const app = express();

// CORS ayarlarını yap
app.use(
  cors({
    origin: "http://localhost:4200", // Frontend'in çalıştığı port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
// JSON ve URL encoded verileri işlemek için middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotaları uygulamaya ekle
app.use("/api/sign-in", signInRoutes);
app.use("/api/expense", expenseRoutes);

// Ana sayfa rotası
app.get("/", (req, res) => {
  res.send("Hoşgeldiniz");
});

// Global hata yönetimi
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Sunucuyu başlat
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
