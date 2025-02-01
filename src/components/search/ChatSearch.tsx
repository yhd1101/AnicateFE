import React, { useState, useEffect } from "react";
import Button from "../Button";

interface ChatSearchProps {
  onSearch: (keyword: string) => void;
  keyword: string;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onSearch, keyword }) => {
  const [searchText, setSearchText] = useState(keyword);
  const [isSearching, setIsSearching] = useState(false); // 검색이 실행되었는지 여부

  useEffect(() => {
    if (!isSearching) {
      setSearchText(keyword); // 검색 중이 아닐 때만 keyword 업데이트
    }
  }, [keyword]);

  const handleSearchClick = () => {
    onSearch(searchText);
    setIsSearching(true); // 검색이 실행되었음을 표시
  };

  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-3xl">
        <div className="grid grid-cols-[6fr_1fr] gap-4 items-center">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setIsSearching(false); // 검색어 입력 중이면 검색 상태 해제
            }}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
            style={{ border: "none" }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
          />
          <Button
            text="검색"
            onClick={handleSearchClick}
            className="p-3 bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition w-20"
          />
        </div>
      </div>
    </section>
  );
};

export default ChatSearch;
