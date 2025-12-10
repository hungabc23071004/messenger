import { Client } from "@stomp/stompjs";

const WS_URL = "ws://localhost:8080/messenger/ws";

let stompClient = null;
let onConnectedCallbacks = [];

// KẾT NỐI WEBSOCKET
export function connectWebSocket(callback) {
  if (stompClient && stompClient.connected) {
    if (callback) callback(stompClient);
    return stompClient;
  }

  const token = localStorage.getItem("token");

  stompClient = new Client({
    brokerURL: WS_URL,
    connectHeaders: {
      Authorization: "Bearer " + token,
    },
    debug: function (str) {
      // console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log("🔌 WebSocket CONNECTED");

      // Gọi callback đã chờ
      onConnectedCallbacks.forEach((cb) => cb(stompClient));
      onConnectedCallbacks = [];

      if (callback) callback(stompClient);
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },
  });

  stompClient.activate();

  return stompClient;
}

// Đợi kết nối xong rồi mới subscribe
export function onConnected(callback) {
  if (stompClient && stompClient.connected) {
    callback(stompClient);
  } else {
    onConnectedCallbacks.push(callback);
  }
}

export function getStompClient() {
  return stompClient;
}

export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 WebSocket DISCONNECTED");
  }
}
