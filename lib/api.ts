import axios from "axios";

export const api = axios.create({
    baseURL: "https://671cc43f09103098807b2157.mockapi.io/api",
});

export default api;
