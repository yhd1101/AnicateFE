import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatSearch from "@/components/search/ChatSearch";
import { useAdminChatQuery } from "@/services/\buseAdminChat";


const AdminChatList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const size = 3; // 페이지당 아이템 수

  // Chat Query 호출
  const { data: chatRooms, isLoading, isError, error } = useAdminChatQuery(currentPage, size);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

  const rooms = chatRooms?.data?.data || []; // 채팅방 배열
  const meta = chatRooms?.data?.meta; // 페이지네이션 정보

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          관리자 채팅 목록
        </h1>
        <div className="w-full">
          <ChatSearch onSearch={(keyword, animalSpecies) => {}} />
        </div>
        <div className="flex flex-col items-start gap-6 w-full max-w-2xl mt-8">
          {/* 채팅방 리스트 */}
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="flex items-center w-full border p-4 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/chatroom/${room.roomId}`)}
            >
              {/* 프로필 이미지 */}
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img
                  src={room.opponentProfileImage || "path/to/default-image.png"}
                  alt={`${room.opponentName} 프로필`}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* 채팅 정보 */}
              <div className="flex flex-col flex-1">
                <h3 className="font-bold text-lg">{room.opponentName}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {room.lastMessage || "대화 내용 없음"}
                </p>
              </div>
              {/* 마지막 메시지 시간 */}
              <div className="text-xs text-gray-400">
                {new Date(room.lastMessageTime).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {meta && (
          <div className="flex gap-2 mt-6 mb-3">
            {Array.from({ length: meta.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1 ? "bg-[#5CA157] text-white" : "bg-white text-gray-600"
                } border hover:bg-[#4A8B42]`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminChatList;
