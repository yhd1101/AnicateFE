// src/components/PetImage.tsx
import React from 'react';

interface PetImageProps {
  src: string;
  alt: string;
  width?: string; // 이미지 넓이
  height?: string; // 이미지 높이
  containerWidth?: string; // 배경 div의 넓이
  containerHeight?: string; // 배경 div의 높이
}

const PetImage: React.FC<PetImageProps> = ({
  src,
  alt,
  width = '250px',  // 기본값을 '250px'로 설정
  height = '300px', // 기본값을 '300px'로 설정
  containerWidth = '250px', // 배경 div 기본값: '250px'
  containerHeight = '300px', // 배경 div 기본값: '300px'
}) => {
  return (
    <div
      className="bg-white mx-auto rounded-full flex justify-center items-center mb-6"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover"
        style={{
          width,
          height,
          borderRadius: '50%',  // 이미지를 동그랗게 만들기 위해 borderRadius를 50%로 설정
        }}
      />
    </div>
  );
};

export default PetImage;
