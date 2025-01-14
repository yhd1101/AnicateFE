import React, { useState } from "react";
import CommunityPost from "@/components/Community/CommunityPost";
import { useFetchCommunity } from "@/services/useFetchCommunity";
import CommunitySearchSection from "@/components/search/ CommunitySearchSection";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatSearch from "@/components/search/ChatSearch";
import Chats from "@/components/Chat/Chats";
import { useChatQuery } from "@/services/useChatData";

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [animalSpecies, setAnimalSpecies] = useState("");

  const { data: chatRooms } = useChatQuery();
  console.log("2313",chatRooms);
  console.log("2313333", chatRooms?.data);

  const { data, isLoading, isError, error } = useFetchCommunity(currentPage, keyword, animalSpecies);

  const handleSearch = (searchKeyword: string, searchAnimalSpecies: string) => {
    setKeyword(searchKeyword);
    setAnimalSpecies(searchAnimalSpecies);
    setCurrentPage(1);
  };

  const handleWritePost = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인하셔야 합니다.");
      return;
    }

    navigate("/community/post");
  };

  const posts = data?.data || [];
  const meta = data?.meta;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error instanceof Error ? error.message : "알 수 없는 오류"}</div>;

  return (
    <>
      <Header/>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5 font-ysabeau">
          관리자와 채팅
        </h1>
        <div className="w-full">
          <ChatSearch onSearch={handleSearch} />
        </div>
            <div className="flex flex-col items-start gap-6 w-full max-w-2xl mt-8">
                <div className="mt-4 flex">
                   
                </div>
            </div>
            {chatRooms?.data.map((room) => (
            <Chats
              key={room.roomId}
              profileUrl="https://www.gravatar.com/avatar/c5f94841c7fa2ad7d9776d2ddd09ce77?s=200&r=pg&d=mm"
              title={room.participantName} // 제목: participantName
              lastMessage={room.lastMessage} // 마지막 메시지
            />
          ))}


      </div>
    </>
   
  );
};

export default ChatList;
