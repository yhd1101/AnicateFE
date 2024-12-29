import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';

// 가상의 데이터
const dummyData = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

const SearchSection: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

  const handleSearchClick = () => {
    const results = dummyData.filter((item) =>
      item.includes(searchText)
    );
    setFilteredResults(results);
  };

  return (
    <section className="bg-[#D8E6BE] flex flex-col items-center py-8 h-48">
      {/* 검색창 */}
      <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-4xl">
        <div className="rounded-3xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* 광역시도 */}
          <Input
            type="text"
            placeholder="광역시도"
            bgColor="#F6F8F1"
            className="p-2 text-sm"
          />

          {/* 시군구 */}
          <Input
            type="text"
            placeholder="시군구"
            bgColor="#F6F8F1"
            className="p-2 text-sm"
          />

          {/* 반려동물 종류 */}
          <Input
            type="text"
            placeholder="반려동물 종류"
            bgColor="#F6F8F1"
            className="p-2 text-sm"
          />

          {/* 검색 버튼 */}
          <Button
            text="검색"
            onClick={handleSearchClick}
            className="p-2 text-sm bg-[#5CA157] text-white font-bold rounded-md hover:bg-[#4A8B42] transition"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
