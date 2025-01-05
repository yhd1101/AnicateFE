import React from 'react';
import ItemList from './ItemList';

import { useNavigate } from 'react-router-dom';
import { useFetchCommunity } from '@/services/useFetchCommunity';

const CommentCommunity: React.FC = () => {
  const { data: PopularInformations, isLoading, error } = useFetchCommunity(1, "", "", "commentCount"); // sortBy=hit
  const navigate = useNavigate();

  console.log("pop", PopularInformations?.data[0]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const handleItemClick = (id: number) => {
    navigate(`/community/${id}`); // id로 이동
  };

  return (
    <ItemList
      title="커뮤니티"
      items={
        Array.isArray(PopularInformations?.data) // PopularInformations.data가 배열인지 확인
          ? PopularInformations.data.map((PopularInformation) => ({
              image: PopularInformation.picture,
              title: PopularInformation.title,
              content: PopularInformation.content,
              id: PopularInformation.id, // id 추가
            }))
          : [] // PopularInformations.data가 배열이 아니면 빈 배열 반환
      }
      onItemClick={handleItemClick} // onClick 이벤트 전달
    />
  );
};

export default CommentCommunity;
