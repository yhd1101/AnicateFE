import React, { useState, useEffect } from "react";
import Button from "../Button";
import axios from "axios";

interface InformationSearchSectionProps {
  onSearch: (speciesName?: string, breedName?: string) => void;
}

const InformationSearch: React.FC<InformationSearchSectionProps> = ({ onSearch }) => {
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>(""); // ✅ 종 선택
  const [breedName, setBreedName] = useState(""); // ✅ 품종 입력

  // ✅ 종 목록 불러오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/species")
      .then((response) => setSpeciesList(response.data.data))
      .catch((error) => console.error("Error fetching species data:", error));
  }, []);

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch(selectedSpecies, breedName);
  };

  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
        <div className="grid grid-cols-[2fr_3fr_1fr] gap-4 items-center">
          
          {/* ✅ 종 선택 (드롭다운) */}
          <select 
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
          >
            <option value="">종 선택</option>
            {speciesList.map((species) => (
              <option key={species.id} value={species.name}>{species.name}</option>
            ))}
          </select>

          {/* ✅ 품종 입력 (Input) */}
          <input
            type="text"
            placeholder="품종을 입력하세요"
            value={breedName}
            onChange={(e) => setBreedName(e.target.value)}
            className="p-3 rounded-md bg-[#F6F8F1] focus:outline-none focus:ring-2 focus:ring-[#5CA157] w-full"
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

export default InformationSearch;
