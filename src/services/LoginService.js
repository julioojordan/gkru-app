import axios from "axios"

const auth = async (username, password) => {
    const baseUrl = process.env.REACT_APP_SERVICE_URL || "http://localhost:3001"
    const url = `${baseUrl}/login`
    const requestBody = {
        username,
        password
    };
    try {
        const response = await axios.post(url, requestBody);
        return Promise.resolve(response.data);
      } catch (error) {
        console.error("Error:", error);
        return Promise.reject(error);
      }
}

export default auth