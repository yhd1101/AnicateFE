import React from 'react';

interface InformationsProps {
  breeName: string;
  age: string;
  height: string;
  weight: string;
  speciesName: string;
  imageUrl: string;
}

const Informations: React.FC<InformationsProps> = ({breeName, age, height, weight, speciesName, imageUrl }) => {
  // Content 최대 길이
  const MAX_CONTENT_LENGTH = 50; // 원하는 길이 설정


  return (
    <div className="w-full bg-[#F6F8F1] max-w-4xl  gap-8 shadow-md rounded-lg p-4 mb-6 flex">

        <div className="w-48 h-48 flex-shrink-0">
            <img
            src={imageUrl}
            alt="Community"
            className="w-full h-full object-cover rounded-md"
            />
        </div>
      {/* 왼쪽: 텍스트 */}
      <div className="flex flex-col justify-between flex-1 pr-4">
        {/* 태그 */}
        <div className="bg-[#D8E6BE] text-black text-sm font-semibold px-3 py-1 rounded-md w-max">
          {speciesName}
        </div>

        {/* 제목 */}
        <span className="text-base line-clamp-1">{breeName}</span>
        <span className="text-base  line-clamp-1">수명: {age}</span>
        <span className="text-base line-clamp-1">높이: {height}</span>
        <span className="text-base   line-clamp-1">체중: {weight}</span>

        {/* 내용 */}
        {/* <p className="text-gray-600 text-sm mt-2">
          {truncateText(content, MAX_CONTENT_LENGTH)}
        </p> */}
      </div>


    </div>
  );
};

export default Informations;
