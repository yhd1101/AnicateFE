import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPetDetails = async (petId: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("로그인이 필요합니다.");

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  const { data } = await axios.get(`http://localhost:8080/api/pets/${petId}`, {
    headers: { Authorization: `Bearer ${sanitizedToken}` },
  });

  return data;
};

export const useGetPetDetails = (petId: number) => {
  return useQuery({
    queryKey: ["petDetails", petId],
    queryFn: () => fetchPetDetails(petId),
    enabled: !!petId, // petId가 있을 때만 요청 실행
    retry: 1, // 실패 시 1번 재시도
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 캐시 유지
  });
};
