import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (gu: string, dong: string) => void; // 구와 동 전달
}

const HospitalSearch: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [gu, setGu] = useState(""); // 구 검색어
  const [dong, setDong] = useState(""); // 동 검색어

  const handleSearch = () => {
    if (!gu && dong) {
      alert("구를 입력해주세요!"); // 둘 다 없으면 경고
      return;
    }

    onSearch(gu, dong); // 부모 컴포넌트에 구와 동 전달
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 items-center">
      <input
        type="text"
        placeholder="구 입력 (선택)"
        value={gu}
        onChange={(e) => setGu(e.target.value)}
        className="p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5CA157]"
      />
      <input
        type="text"
        placeholder="동 입력 (선택)"
        value={dong}
        onChange={(e) => setDong(e.target.value)}
        className="p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5CA157]"
      />
      <img
        src="/search.png"
        alt="검색"
        onClick={handleSearch}
        className="cursor-pointer w-10 h-10 hover:opacity-80 transition-opacity"
      />
    </div>
  );
};

export default HospitalSearch;
