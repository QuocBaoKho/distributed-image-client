import { io } from "socket.io-client";
const PORT = 3000;
const socket = io(`http://localhost:${PORT}`); // Replace with your backend IP

export default socket;
