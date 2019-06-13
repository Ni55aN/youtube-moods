const axios = require('axios');

async function apiRequest(path, params) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/${path}`, {
            params
        });

        return response.data;
    } catch(e) {
        console.log("\x1b[31m Error: \x1b[0m", e.response.data.error.errors)
        throw e;
    }
}

module.exports = { apiRequest }