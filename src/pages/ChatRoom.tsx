import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import Header from "@/components/Header";

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id")
    ? parseInt(sessionStorage.getItem("id")!, 10)
    : null;

  const [messages, setMessages] = useState<
    { senderName: string; content: string; timestamp: string; sender: number }[]
  >([]);

  console.log("mses", messages);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // 스크롤 상태 관리
  const stompClientRef = useRef<Client | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const getToken = (): string => {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");
    return token.replace(/"/g, "");
  };

  const handleScroll = () => {
    if (!messageContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 거의 맨 아래
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    if (isAtBottom && messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(); // 메시지가 추가될 때만 맨 아래로 스크롤
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    const token = getToken();

    const client = new Client({
      webSocketFactory: () => new SockJS("/chat-socket"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("WebSocket debug:", str),
      reconnectDelay: 5000,
    });

    fetchChatLogs(token);

    client.onConnect = () => {
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        fetchChatLogs(token);
        setMessages((prev) => [
          ...prev,
          {
            senderName: receivedMessage.senderName,
            content: receivedMessage.content,
            timestamp: receivedMessage.sentAt,
            sender: receivedMessage.userId,
          },
        ]);
      });
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
      const data = response.data.data;

      if (Array.isArray(data)) {
        setMessages(
          data.map((msg) => ({
            senderName: msg.senderName,
            content: msg.content,
            timestamp: msg.sentAt,
            sender: msg.senderId,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch chat logs:", error);
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
      type: "TALK",
      userId,
    };

    const token = getToken();

    stompClientRef.current?.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(messagePayload),
      headers: { Authorization: `Bearer ${token}` },
    });

    setNewMessage("");
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      <Header />
      <div className="flex justify-between items-center px-4 py-2 bg-white">
  {/* 🔙 뒤로가기 버튼 */}
  <button
    onClick={() => navigate("/chatlist")}
    className="text-white text-2xl font-bold bg-[#D8E6BE] px-3 py-1 rounded-md"
  >
    ←
  </button>

  {/* 채팅방 제목 */}
  <h1 className="text-2xl font-bold text-[#5CA157]">채팅하기 {roomId}</h1>

  {/* 🚪 나가기 버튼 */}
  <button
    className="bg-[#D8E6BE] px-4 py-2 rounded-md font-bold text-white"
  >
    나가기
  </button>
</div>

      <div
  ref={messageContainerRef}
  className="flex-1 overflow-y-auto px-4"
  onScroll={handleScroll}
>
  {messages.map((message, index) => {
    const isMyMessage = message.sender === userId;

    // ✅ SYSTEM 메시지일 경우 (중앙 정렬, 말풍선 X)
    if (message.senderName === "SYSTEM") {
      return (
        <div key={index} className="text-center text-gray-500 text-sm my-2">
          {message.content}
        </div>
      );
    }

    // ✅ 일반 메시지 (사용자 대화)
    return (
      <div
        key={index}
        className={`flex gap-3 ${
          isMyMessage ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`p-4 rounded-lg ${
            isMyMessage ? "bg-[#F9F7DE]" : "bg-[#F6F8F1]"
          } max-w-[70%]`}
        >
          <p className="text-sm font-bold">{message.senderName}</p>
          <p>{message.content}</p>
          <small className="text-gray-400 text-xs">{message.timestamp}</small>
        </div>
      </div>
    );
  })}
</div>

      <div className="bg-[#D8E6BE] w-full py-4 px-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Enter 시 기본 동작 방지
              handleSendMessage();
            }
          }}
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
