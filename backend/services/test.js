const axios = require("axios");

const url = "https://demo.campay.net/api/token/";

const data = {
  username:
    "h8NlaH6vPtgvVhbRpwYE6WBK42PTzSznAJltPEUzY3KAj8BTs4lEsbFy3iLlhybUIHfjhRvgHuX9wQYEq7bb2g",
  password:
    "WIpn_giF9nRgHsvD0P9bzpZWIZpGnEUbkdoKtZ5a6pxPKCv4t5c8MgIa6FqQ1BL_xV4tQSZjo87CsU7ZIStmuA",
};

async function fetchToken() {
  try {
    console.log("Fetching new token...");
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

// Call the function
fetchToken();
