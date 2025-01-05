import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface PetDTO {
  id: number;
  userId: number | null;
  speciesId: number | null;
  breedId: number | null;
  name: string;
  age: string;
  picture: string;
  gender: string;
  speciesName: string;
  breedName: string;
  createdAt: string;
  updatedAt: string;
}

const fetchPetData = async (userId: number) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  
  // 양쪽 따옴표 제거
  const cleanedToken = token.replace(/^"(.*)"$/, '$1');

  const response = await axios.get(`http://localhost:8080/api/pets`, {
    headers: {
      Authorization: `Bearer ${cleanedToken}`,
    },
  });
  
  return response.data; // 반려동물 데이터 반환
};

export const usePetQuery = (userId: number) => {
  return useQuery({
    queryKey: ['pets', userId],
    queryFn: () => fetchPetData(userId),
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
