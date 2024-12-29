// src/components/PopularHospitals.tsx
import React from 'react';
import ItemList from './ItemList';

const PopularHospitals: React.FC = () => {
  const hospitals = [
    { image: '/Image.png', title: '병원 1', content: '여기에는 병원 1에 대한 간단한 설명이 들어갑니다.' },
    { image: '/image 8.png', title: '병원 2', content: '여기에는 병원 2에 대한 간단한 설명이 들어갑니다.' },
    { image: '/image 8.png', title: '병원 3', content: '여기에는 병원 3에 대한 간단한 설명이 들어갑니다.' },
  ];

  return <ItemList title="인기 병원" items={hospitals} />;
};

export default PopularHospitals;
