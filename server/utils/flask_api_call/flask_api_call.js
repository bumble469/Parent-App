const axios = require('axios');
const FLASK_API_URL = "https://parent-encryption.onrender.com";

async function callFlaskEncryptAPI(endpoint, data) {
    try {
        const response = await axios.post(
            `${FLASK_API_URL}/${endpoint}`,
            { data }, 
            {
                headers: {
                    'Content-Type': 'application/json' 
                }
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Failed to call Flask API: ", error.response ? error.response.data : error.message);
        throw new Error("Failed!");
    }
}

async function callFlaskDecryptAPI(encryptedData, encryptedAESKey) {
    try {
        const decryptData = {
            encrypted_data: encryptedData,
            encrypted_aes_key: encryptedAESKey
        };
        const response = await axios.post(
            `${FLASK_API_URL}/decrypt`,
            decryptData,
            {
                headers: {
                    'Content-Type': 'application/json'  
                }
            }
        );
        return response.data.decrypted_data;
    } catch (error) {
        console.error("Failed to call Flask decrypt: ", error.response ? error.response.data : error.message);
        throw new Error("Failed");
    }
}

module.exports = {
    callFlaskEncryptAPI,
    callFlaskDecryptAPI
};
