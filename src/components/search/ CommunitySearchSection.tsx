import React, { useState } from "react";
import Button from "../Button";
import { useFetchAnimalSpecies } from "@/services/useFetchAnimalSpecies";

interface CommunitySearchSectionProps {
  onSearch: (keyword: string, category: string) => void;
}

const CommunitySearchSection: React.FC<CommunitySearchSectionProps> = ({ onSearch }) => {
  const [selectedOption, setSelectedOption] = useState("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // ✅ React Query로 종 목록 가져오기
  const { data: speciesList } = useFetchAnimalSpecies();

  // // ✅ 종 리스트 (API 데이터 사용)
  // const animalSpeciesOptions = ["전체", ...(speciesList?.data?.animalSpeciesList || [])];

  const handleSearchClick = () => {
    onSearch(searchText, selectedOption === "전체" ? "" : selectedOption);
    
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-2xl">
        <div className="grid grid-cols-[8fr_1fr] gap-4 items-center">
          {/* ✅ 드롭다운 (동물 종 선택) */}
         

          {/* ✅ 검색 입력창 */}
          <input
            type="text"
            placeholder="제목, 내용을 입력해주세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
            style={{ border: "none" }}
          />

          {/* ✅ 검색 버튼 */}
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

export default CommunitySearchSection;
