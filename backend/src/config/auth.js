const axios = require('axios');

const AUTH_URL = "http://20.244.56.144/evaluation-service/auth";

const credentials = {
  email: process.env.LOG_EMAIL,
  name: "Aryan Pandey",
  rollNo: process.env.LOG_ROLLNO,
  accessCode: process.env.LOG_ACCESS_CODE,
  clientID: process.env.LOG_CLIENT_ID,
  clientSecret: process.env.LOG_CLIENT_SECRET
};

let accessToken = null;
let expiryTime = null;

async function getToken() {
  const now = new Date();
  if (!accessToken || (expiryTime && now > expiryTime)) {
    try {
      const response = await axios.post(AUTH_URL, credentials);
      accessToken = response.data.access_token;
      expiryTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry fallback
      return accessToken;
    } catch (error) {
      console.error("Token fetch failed:", error.message);
      throw new Error("Failed to authenticate for logging");
    }
  }
  return accessToken;
}

module.exports = { getToken };
