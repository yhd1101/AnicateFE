import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient: any = null;

export const initializeWebSocket = (roomId: string, token: string, onMessageReceived: (message: any) => void) => {
  const socket = new SockJS("http://localhost:8080/chat-socket");
  stompClient = Stomp.over(socket);

  stompClient.connect(
    { Authorization: `Bearer ${token}` }, // WebSocket 연결 시 JWT 토큰 추가
    () => {
      console.log("WebSocket connected!");

      // 메시지 수신 경로 구독
      stompClient.subscribe(`/topic/chat/${roomId}`, (message: any) => {
        const parsedMessage = JSON.parse(message.body);
        onMessageReceived(parsedMessage); // 메시지 수신 콜백 호출
      });
    },
    (error: any) => {
      console.error("WebSocket connection error:", error);
      alert("WebSocket connection failed!");
    }
  );
};

export const sendMessage = (roomId: string, message: string, token: string) => {
  if (!stompClient || !stompClient.connected) {
    alert("WebSocket is not connected!");
    return;
  }

  stompClient.send(
    `/app/chat/${roomId}`, // 서버로 메시지 전송
    { Authorization: `Bearer ${token}` },
    JSON.stringify({ content: message })
  );
};
