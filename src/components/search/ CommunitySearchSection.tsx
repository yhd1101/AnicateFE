import React, { useState, useEffect } from "react";
import Button from "../Button";
import axios from "axios";

interface CommunitySearchSectionProps {
  onSearch: (keyword: string, animalSpecies: string) => void;
}

const CommunitySearchSection: React.FC<CommunitySearchSectionProps> = ({ onSearch }) => {
  const [selectedOption, setSelectedOption] = useState("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [animalSpeciesOptions, setAnimalSpeciesOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnimalSpecies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/community");
        const species = response.data.data.data.map((item: any) => item.animalSpecies);
        const uniqueSpecies = Array.from(new Set(species));
        setAnimalSpeciesOptions(["전체", ...uniqueSpecies]);
      } catch (error) {
        console.error("Error fetching animal species:", error);
      }
    };

    fetchAnimalSpecies();
  }, []);

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
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
        <div className="grid grid-cols-[1fr_4fr_1fr] gap-4 items-center">
          <div className="relative">
            <button
              className="p-3 w-full rounded-md bg-[#F6F8F1] text-left focus:outline-none"
              onClick={toggleDropdown}
              style={{ border: "none" }}
            >
              {selectedOption || "전체"}
            </button>
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-[#D8E6BE] rounded-md shadow-md z-10">
                {animalSpeciesOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="px-4 py-2 hover:bg-[#C0D4A8] cursor-pointer text-sm"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
            style={{ border: "none" }}
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

export default CommunitySearchSection;
