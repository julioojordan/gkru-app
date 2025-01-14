import axios from "axios"

const auth = async (username, password) => {
    const url = "http://localhost:3001/login"
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