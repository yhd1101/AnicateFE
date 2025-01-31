import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatSearch from "@/components/search/ChatSearch";
import { useChatQuery } from "@/services/useChatData";

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [animalSpecies, setAnimalSpecies] = useState("");

  // ✅ API 호출 (페이지네이션 적용)
  const { data, isLoading, isError, error } = useChatQuery(currentPage, keyword, animalSpecies);

  // ✅ 검색 핸들러 (검색 시 첫 페이지로 이동)
  const handleSearch = (searchKeyword: string, searchAnimalSpecies: string) => {
    setKeyword(searchKeyword);
    setAnimalSpecies(searchAnimalSpecies);
    setCurrentPage(1);
  };

  const handlePost = () => {
    navigate("/chatroompost")
  }

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

  // ✅ API 응답 데이터 정리
  const chatRooms = data?.data?.data || [];
  const meta = data?.data?.meta;

  console.log("Chat Rooms:", chatRooms);
  console.log("Meta Data:", meta);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          관리자와 채팅
        </h1>
        <div className="w-full">
          <ChatSearch onSearch={handleSearch} />
        </div>

        {/* ✅ 채팅방 리스트 (항상 3개 공간 유지) */}
        <div className="flex flex-col items-end gap-6 w-full max-w-2xl mt-8 min-h-[400px]">
          <div >
            <button
            onClick={handlePost} 
            className="p-2 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
            >
              상담받기
            </button>
          </div>

          {chatRooms.length > 0 ? (
            <>
              {chatRooms.map((room) => (
                <div
                  key={room.roomId}
                  className="flex justify-between items-center w-full border p-4 rounded-md shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-lg">{room.roomName}</h3>
                    <p className="text-sm text-gray-500">{room.description}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => navigate(`/chatroom/${room.roomId}`)}
                  >
                    입장
                  </button>
                </div>
              ))}
              {/* ✅ 데이터가 3개 미만이면 빈 div 추가해서 높이 맞추기 */}
              {Array.from({ length: Math.max(0, 3 - chatRooms.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="w-full p-4 opacity-0">
                  {/* 빈 박스: 높이만 차지함 */}
                </div>
              ))}
            </>
          ) : (
            <div>채팅방이 없습니다.</div>
          )}
        </div>

        {/* ✅ 페이지네이션 (항상 가운데 정렬) */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 mb-3 min-w-[160px]">
            {Array.from({ length: Math.max(3, meta.totalPages) }, (_, index) => {
              const pageNumber = index + 1;
              return (
                pageNumber <= meta.totalPages && (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === pageNumber ? "bg-[#5CA157] text-white" : "bg-white text-gray-600"
                    } border hover:bg-[#4A8B42]`}
                  >
                    {pageNumber}
                  </button>
                )
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatList;
