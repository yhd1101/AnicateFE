import React, { useState, useEffect } from "react";
import Button from "../Button";
import axios from "axios";

interface InformationSearchSectionProps {
  onSearch: (keyword?: string, animalSpecies?: string) => void; // props를 선택적으로 받도록 수정
}

const InformationSearch: React.FC<InformationSearchSectionProps> = ({ onSearch }) => {
  const [speciesName, setSpeciesName] = useState("");
  const [breedName, setBreedName] = useState("");

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 기본 동작(새로고침) 방지
    if (onSearch) {
      onSearch(speciesName, breedName); // 검색어 전달
    }
  };

  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
        <div className="grid grid-cols-[2fr_3fr_1fr] gap-4 items-center">
          {/* 종 입력 */}
          <input
            type="text"
            placeholder="종을 입력하세요"
            value={speciesName}
            onChange={(e) => setSpeciesName(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
          />
          {/* 품종 입력 */}
          <input
            type="text"
            placeholder="품종을 입력하세요"
            value={breedName}
            onChange={(e) => setBreedName(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
          />
          {/* 검색 버튼 */}
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

export default InformationSearch;
