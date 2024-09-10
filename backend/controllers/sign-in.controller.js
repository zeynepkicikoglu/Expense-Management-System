import * as signService from "../services/sign-in.service.js";
import { setGlobalPersonId } from "../utils/global.js";

export const login = async (req, res) => {
  const { personId, password } = req.body;
  try {
    console.log("login controller hitted", req.body);

    const result = await signService.login(personId, password);

    // Gelen yanıtın yapısını kontrol edin
    console.log("Result from signService:", result);

    if (result.Success) {
      // Global değişkende personId'yi sakla
      setGlobalPersonId(personId);

      // Burada Success alanını kontrol edin
      console.log("FRONTENDE GİTTİ", result);
      res.json({
        success: true,
        token: result.token,
        person: result.person,
        userId: personId,
        personName: result.Name,
      });
    } else {
      console.log("FRONTENDE GİDEMEDİ", result);
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error" });
  }
};

// Token alma fonksiyonu
export const getToken = async (req, res) => {
  try {
    console.log("token controller hitted");

    const tokenInfo = await signService.getToken();
    res.json(tokenInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching token" });
  }
};
