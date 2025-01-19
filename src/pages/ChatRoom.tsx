import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Header from "@/components/Header";
import axios from "axios";

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId 추출
  const [messages, setMessages] = useState<
    { senderName: string; content: string; timestamp?: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  // JWT 토큰 가져오기
  const getToken = (): string => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token not found in sessionStorage!");
      throw new Error("Authentication token is missing");
    }
    return token.replace(/"/g, ""); // 따옴표 제거
  };

  useEffect(() => {
    if (!roomId) {
      console.error("Room ID is missing!");
      return;
    }

    const token = getToken();

    const client = new Client({
      webSocketFactory: () => new SockJS("/chat-socket"), // Proxy 설정으로 경로 수정
      connectHeaders: {
        Authorization: `Bearer ${token}`, // JWT 토큰 포함
      },
      debug: (str) => console.log(`STOMP Debug: ${str}`), // 디버깅 로그
      reconnectDelay: 5000, // 연결 재시도 딜레이
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket ✅");

      // WebSocket 메시지 수신 시 처리
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            senderName: receivedMessage.senderName,
            content: receivedMessage.content,
            timestamp: receivedMessage.sentAt,
          },
        ]);
      });

      fetchChatLogs(token); // 기존 채팅 기록 로드
    };

    client.onStompError = (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    client.activate(); // WebSocket 활성화
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket connection closed");
      }
    };
  }, [roomId]);

  // 기존 채팅 기록 가져오기
  const fetchChatLogs = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/chat/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data; // 응답 데이터에서 메시지 목록 가져오기
      if (Array.isArray(data)) {
        setMessages(
          data.map((msg: any) => ({
            senderName: msg.senderName,
            content: msg.content,
            timestamp: msg.sentAt,
          }))
        );
      } else {
        console.error("Invalid data format:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat logs:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("WebSocket client is not connected!");
      return;
    }

    const token = getToken();
    const messagePayload = {
      content: newMessage,
      roomId,
    };

    // WebSocket을 통해 메시지 전송
    stompClientRef.current.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(messagePayload),
    });

    // 전송된 메시지를 로컬 상태에 추가
    setMessages((prev) => [
      ...prev,
      { senderName: "You", content: newMessage, timestamp: new Date().toLocaleString() },
    ]);
    setNewMessage(""); // 입력 필드 초기화
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      <Header />
      <h1 className="text-2xl font-bold text-[#5CA157] text-center mt-4 mb-6">
        Chat Room: {roomId}
      </h1>
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.senderName === "You" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`p-4 rounded-lg ${
                message.senderName === "You" ? "bg-[#F9F7DE]" : "bg-[#F6F8F1]"
              } max-w-[70%]`}
            >
              <p className="text-sm font-bold">{message.senderName}</p>
              <p>{message.content}</p>
              <small className="text-gray-400 text-xs">{message.timestamp}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#D8E6BE] w-full py-4 px-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 rounded-md bg-[#F9F7DE] focus:outline-none focus:ring-2 focus:ring-[#5CA157]"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
