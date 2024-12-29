// src/components/PopularCommunities.tsx
import React from 'react';
import ItemList from './ItemList';

const PopularCommunities: React.FC = () => {
  const communities = [
    { image: '/image 8.png', title: '커뮤니티 1', content: '여기에는 커뮤니티 1에 대한 간단한 설명이 들어갑니다.' },
    { image: '/image 8.png', title: '커뮤니티 2', content: '여기에는 커뮤니티 2에 대한 간단한 설명이 들어갑니다.' },
    { image: '/image 8.png', title: '커뮤니티 3', content: '여기에는 커뮤니티 3에 대한 간단한 설명이 들어갑니다.' },
  ];

  return <ItemList title="인기 커뮤니티" items={communities} />;
};

export default PopularCommunities;
