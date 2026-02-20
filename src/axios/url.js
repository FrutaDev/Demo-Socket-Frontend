import axios from "axios";
import { io } from "socket.io-client";

export const API_URL = "http://localhost:3000";

const API = axios.create({
    baseURL: API_URL,
});

export const socket = io(API_URL)

export default API;