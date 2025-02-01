import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 종 조회 API 호출 함수
const fetchAnimalSpecies = async (): Promise<string[]> => {
  const response = await axios.get("http://localhost:8080/api/community/species");
  return response?.data; // `AnimalSpeciesDTO`의 `species` 배열 반환
};

// ✅ React Query `useQuery` 훅
export const useFetchAnimalSpecies = () => {
  return useQuery({
    queryKey: ["animalSpecies"],
    queryFn: fetchAnimalSpecies,
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};
