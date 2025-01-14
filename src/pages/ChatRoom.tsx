import React, { useState } from "react";
import Header from "@/components/Header";

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([
    { sender: "Participant", content: "안녕하세요! 상담 도와드리겠습니다." },
    { sender: "You", content: "안녕하세요! 반갑습니다." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [...prev, { sender: "You", content: newMessage }]);
    setNewMessage("");

    // 예시로 상대방의 자동 응답 추가
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "Participant", content: "네, 어떤 도움이 필요하신가요?" },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      <Header />

      {/* 중앙 참여자 이름 */}
      <h1 className="text-2xl font-bold text-[#5CA157] text-center mt-4 mb-6">
        Chat with Participant
      </h1>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.sender === "You" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            {message.sender !== "You" && (
              <img
                src="https://www.gravatar.com/avatar/c5f94841c7fa2ad7d9776d2ddd09ce77?s=200&r=pg&d=mm"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div
              className={`p-4 rounded-lg ${
                message.sender === "You" ? "bg-[#F9F7DE]" : "bg-[#F6F8F1]"
              } max-w-[70%]`}
            >
              <p className="text-sm font-bold">{message.sender}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
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
