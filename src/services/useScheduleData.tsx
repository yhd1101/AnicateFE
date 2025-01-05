import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 백엔드 DTO와 동일한 구조를 가진 TypeScript 인터페이스 정의
interface SingleScheduleDTO {
  id: number;
  petId: number | null;
  userId: number | null;
  name: string;
  periodicScheduleId: number | null;
  startDatetime: string;
  endDatetime: string;
  createdAt: string;
  updatedAt: string;
}

// SingleSchedule 데이터를 가져오는 함수
const fetchSingleSchedules = async (): Promise<SingleScheduleDTO[]> => {
  // 세션 스토리지에서 토큰 가져오기
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  // 토큰에서 양쪽 따옴표 제거
  const cleanedToken = token.replace(/^"(.*)"$/, '$1');

  // Axios를 사용하여 API 요청 보내기
  const response = await axios.get('http://localhost:8080/api/singleSchedules', {
    headers: {
      Authorization: `Bearer ${cleanedToken}`, // 인증 헤더에 토큰 포함
    },
  });

  return response.data.data; // 데이터 반환 (data 필드 안에 데이터가 있을 경우)
};

// React Query 훅 생성
export const useSingleScheduleQuery = () => {
  return useQuery({
    queryKey: ['singleSchedules'], // 쿼리 키 정의
    queryFn: fetchSingleSchedules, // 데이터를 가져오는 함수
    staleTime: 1000 * 60 * 5, // 데이터 신선도 유지 시간 (5분)
  });
};
