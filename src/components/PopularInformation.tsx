import React from 'react';
import ItemList from './ItemList';
import { useFetchInformation } from '@/services/useFetchInformation';
import { useNavigate } from 'react-router-dom';

const PopularInformation: React.FC = () => {
  const { data: PopularInformations, isLoading, error } = useFetchInformation(1, "", "", "hit"); // sortBy=hit
  const navigate = useNavigate();

  console.log("pop", PopularInformations);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const handleItemClick = (id: number) => {
    navigate(`/information/${id}`); // id로 이동
  };

  return (
    <ItemList
      title="조회수 많은 반려동물"
      items={
        Array.isArray(PopularInformations?.data) // PopularInformations.data가 배열인지 확인
          ? PopularInformations.data.map((PopularInformation) => ({
              image: PopularInformation.picture,
              title: PopularInformation.breedName,
              content: PopularInformation.description,
              id: PopularInformation.id, // id 추가
            }))
          : [] // PopularInformations.data가 배열이 아니면 빈 배열 반환
      }
      onItemClick={handleItemClick} // onClick 이벤트 전달
    />
  );
};

export default PopularInformation;
