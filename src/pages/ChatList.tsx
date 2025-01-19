import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatSearch from "@/components/search/ChatSearch";
import { useChatQuery } from "@/services/useChatData";

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [animalSpecies, setAnimalSpecies] = useState("");

  // Chat Query를 호출
  const { data: chatRooms, isLoading, isError, error } = useChatQuery();


  // 검색 핸들러
  const handleSearch = (searchKeyword: string, searchAnimalSpecies: string) => {
    setKeyword(searchKeyword);
    setAnimalSpecies(searchAnimalSpecies);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

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
        <div className="flex flex-col items-start gap-6 w-full max-w-2xl mt-8">
          {chatRooms?.data?.data?.map((room) => (
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
        </div>
      </div>
    </>
  );
};

export default ChatList;
