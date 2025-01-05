import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

// 가상의 데이터

interface SearchBarProps {
  onSearch: (gu: string, dong: string) => void; // 구와 동 전달
}


const SearchSection: React.FC<SearchBarProps> = ({onSearch}) => {
  const navigate =useNavigate();
  const [gu, setGu] = useState(""); // 구 검색어
  const [dong, setDong] = useState(""); // 동 검색어
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const handleSearch = () => {
    if (!gu && dong) {
      alert("구를 입력해주세요!"); // 둘 다 없으면 경고
      return;
    }
    console.log(gu);
    

    onSearch(gu, dong); // 부모 컴포넌트에 구와 동 전달
    navigate("/hospital", { state: { gu, dong } });
  };
  
  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8 h-48">
      {/* 검색창 */}
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
        <div className="rounded-3xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* 광역시도 */}
          <Input
            type="text"
            placeholder="구 입력"
            value={gu}
            onChange={(e) => setGu(e.target.value)}
            bgColor="#F6F8F1"
            className="p-2 text-sm"
          />
            <Input
            type="text"
            placeholder="동 입력"
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            bgColor="#F6F8F1"
            className="p-2 text-sm"
          />

        

          {/* 검색 버튼 */}
          <Button
            text="검색"
            onClick={handleSearch}
            className="p-2 text-sm bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
