import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WS_URL = "http://localhost:8080/messenger/ws";
let stompClient = null;

export function connectWebSocket(onConnect) {
  if (stompClient && stompClient.connected) return stompClient;

  const socket = new SockJS(WS_URL);
  stompClient = Stomp.over(socket);

  const token = localStorage.getItem("token");

  stompClient.connect(
    { Authorization: "Bearer " + token },
    () => {
      if (onConnect) onConnect(stompClient);
    },
    (error) => {
      console.error("WebSocket error:", error);
    }
  );

  return stompClient;
}

export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
    stompClient = null;
  }
}

export function getStompClient() {
  return stompClient;
}
