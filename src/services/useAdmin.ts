import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CommunityDTO {
  id: number;
  title: string;
  content: string;
  animalSpecies: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailResponseDTO {
  id: number;
  name: string;
  email: string;
  profileImg: string;
  communities: CommunityDTO[];
  createdAt: string;
  updatedAt: string;
}

const fetchUserData = async (): Promise<UserDetailResponseDTO> => {
  let token = sessionStorage.getItem('token'); // 세션에서 토큰 가져오기
  console.log('Token:', token);

  if (!token) {
    throw new Error('No token found');
  }

  // 양쪽 따옴표만 제거
  token = token.replace(/^"(.*)"$/, '$1'); // 시작과 끝의 따옴표 제거
  console.log("Token without quotes:", token);

  // axios를 이용해 요청 보내기
  const response = await axios.get('http://localhost:8080/api/admin', {
    headers: {
      Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
    },
  });

  console.log(response, "s222");
  return response.data; // 데이터를 반환

};

export const useAdminQuery = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: fetchUserData,
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
