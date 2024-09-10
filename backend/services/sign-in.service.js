import axios from "axios";
import { setGlobalPersonId } from "../utils/global.js";

// Token alma fonksiyonu
export const getToken = async () => {
  console.log("Get token hitted");
  const tokenEndpoint =
    "https://pame8xi-dev1.build.ifs.cloud/auth/realms/pame8xidev1/protocol/openid-connect/token";
  const clientId = "NEXT_ZEY";
  const clientSecret = "YyER8d9J2XtLKJX1decY9Ldw0JEZSnQz";

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(tokenEndpoint, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Get token response: ", response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Error fetching token", error);
    throw error;
  }
};

// Giriş yapma fonksiyonu
export const login = async (personId, password) => {
  console.log("Login service hitted. PersonId:", personId);
  const tokenInfo = await getToken();
  console.log("Token info:", tokenInfo);

  const serviceUrl = `https://pame8xi-dev1.build.ifs.cloud/int/ifsapplications/projection/v1/NextZeyService.svc/Login(PersonId='${encodeURIComponent(
    personId
  )}',Password='${encodeURIComponent(password)}')`;

  try {
    const response = await axios.get(serviceUrl, {
      headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
    });

    console.log("Login response:", response);
    console.log("Login response:", response.status);

    // Giriş başarılıysa, global personId'yi ayarla
    if (response.data.Success) {
      console.log("person id service:", personId);
      setGlobalPersonId(personId); // Global personId'yi ayarlıyoruz.
    }

    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};
