const axios = require('axios');
const { getToken } = require('./auth');

const LOG_URL = "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, logPackage, message) {
  try {
    const token = await getToken();

    const response = await axios.post(LOG_URL, {
      stack,
      level,
      package: logPackage,
      message
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.data?.logID) {
      console.log("Log created successfully with ID:", response.data.logID);
    } else {
      console.warn("Log created, but no logID returned.");
    }
  } catch (err) {
    console.error("Log error:", err.message);
  }
}

module.exports = { Log };
