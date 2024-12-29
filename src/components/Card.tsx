// src/components/Card.tsx

import React from 'react';

interface CardProps {
  image: string;
  title: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ image, title, content }) => {
  return (
    <div className="w-[300px] h-[400px] bg-white shadow-lg rounded-lg p-4 flex flex-col">
      {/* 이미지만 중앙 정렬 */}
      <div className="flex justify-center items-center mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-[200px] object-cover" // 이미지 크기 유동적으로 설정
        />
      </div>
      {/* 제목은 왼쪽 정렬 */}
      <h3 className="text-xl font-semibold text-[#000000] mb-2 text-left">{title}</h3>
      <p className="text-sm text-[#828282]">{content}</p>
    </div>
  );
};

export default Card;
