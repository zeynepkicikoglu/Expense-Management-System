import express from "express";
import { getToken, login } from "../controllers/sign-in.controller.js";

const router = express.Router();

// Token al
router.post("/token", getToken);
// Giriş yapma
router.post("/login", login);

export default router;
