import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 반려동물 삭제 API 호출 함수
const fetchDeletePet = async (petId: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/pet/${petId}`); // 토큰 없이 삭제 요청
};

// React Query 훅 생성
export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeletePet, // 삭제 API 호출 함수
    onSuccess: (_, petId) => {
      console.log(`반려동물 ${petId} 삭제 성공`);

      // 특정 반려동물 쿼리 제거
      queryClient.removeQueries(["pet", petId]); // petId와 연관된 데이터 삭제

      // 반려동물 목록 쿼리 무효화
      queryClient.invalidateQueries(["pets", Number(sessionStorage.getItem("userId"))]);

      alert("반려동물이 성공적으로 삭제되었습니다!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("반려동물 삭제 실패:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("반려동물 삭제에 실패했습니다.");
    },
  });
};
