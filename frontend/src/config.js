let apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
if (!apiUrl.startsWith('http')) {
    apiUrl = `https://${apiUrl}`;
}

const config = {
    API_URL: apiUrl
};

export default config;
