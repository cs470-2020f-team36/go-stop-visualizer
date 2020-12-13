// return a socket object

import io from "socket.io-client";

const SERVER_URL = "https://cs470-go-stop.herokuapp.com/";
export const socket = io(SERVER_URL);
