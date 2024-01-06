import axios from "axios";

const url = import.meta.env.VITE_API || "http://localhost:8000";
const server = axios.create({
    baseURL: url
});

export default server;
