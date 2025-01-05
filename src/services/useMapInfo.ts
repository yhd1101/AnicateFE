import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/animal-hospitals/nearby';

// API 호출 함수
const fetchNearbyHospitals = async (latitude: number, longitude: number) => {
  const response = await axios.get(API_URL, {
    params: { latitude, longitude },
  });
  return response.data; // API 응답 데이터 반환
};

// React Query 훅 정의
export const useMapInfo = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ['nearbyHospitals', latitude, longitude], // React Query 키
    queryFn: () => fetchNearbyHospitals(latitude, longitude), // 데이터 호출 함수
    enabled: latitude !== 0 && longitude !== 0, // 좌표가 0이 아닌 경우에만 실행
    retry: false, // 에러 시 재시도 비활성화
  });
};
