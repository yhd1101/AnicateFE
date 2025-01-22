import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import Header from "@/components/Header";

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<
  { senderName: string; content: string; timestamp?: string }[]
>([]); // 빈 배열로 초기화

  const [newMessage, setNewMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  const getToken = (): string => {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");
    return token.replace(/"/g, "");
  };

  useEffect(() => {
    if (!roomId) return;

    const token = getToken();

    const client = new Client({
      webSocketFactory: () => new SockJS("/chat-socket"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("WebSocket debug:", str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
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

      fetchChatLogs(token);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const fetchChatLogs = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/rooms/${roomId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );



      console.log(response, "resposnesss");
  
      // 응답 데이터가 배열인지 확인
      const data = response.data.data;
      console.log("231233", data.data);
      if (Array.isArray(data)) {
        console.log("dars", data);

        setMessages(
          data.map((msg) => ({
        
            senderName: msg.senderName,
            content: msg.content,
            timestamp: msg.sentAt,
          }))
        );
      } else {
        console.error("Invalid response format:", data);
        setMessages([]); // 비어 있는 상태로 설정
      }
    } catch (error) {
      console.error("Failed to fetch chat logs:", error);
      setMessages([]); // 에러 발생 시 빈 배열로 설정
    }
  };
  

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }
    if (newMessage.length > 1000) {
      alert("메시지는 1000자를 초과할 수 없습니다.");
      return;
    }
  
    const messagePayload = {
      content: newMessage,
      roomId,
      type: "SYSTEM",
    };
  
    const token = getToken(); // JWT 토큰 가져오기
  
    console.log("Sending payload:", messagePayload);
  
    stompClientRef.current?.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(messagePayload),
      headers: { Authorization: `Bearer ${token}` }, // 헤더에 JWT 토큰 추가
    });
  
    setMessages((prev) => [
      ...prev,
      { senderName: "You", content: newMessage, timestamp: new Date().toLocaleString() },
    ]);
    setNewMessage("");
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
