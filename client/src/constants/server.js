import axios from "axios";

const url = `${import.meta.env.VITE_API}`;
const server = axios.create({
    baseURL: url
});

export default server;
