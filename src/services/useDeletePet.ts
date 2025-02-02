import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 반려동물 삭제 API 호출 함수
const fetchDeletePet = async (petId: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/pet/${petId}`); // API 호출
};

// React Query 훅 생성
export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeletePet, // 삭제 API 호출 함수
    onMutate: async (petId: number) => {
      await queryClient.cancelQueries(["pets"]); // 기존 목록 조회 취소

      // 이전 반려동물 목록 저장
      const previousPets = queryClient.getQueryData<PetDTO[]>(["pets"]);

      // UI에서 미리 삭제 (Optimistic UI)
      queryClient.setQueryData(["pets"], (oldPets: PetDTO[] | undefined) => {
        return oldPets ? oldPets.filter((pet) => pet.id !== petId) : [];
      });

      return { previousPets }; // 기존 데이터를 컨텍스트로 저장
    },
    onSuccess: (_, petId) => {
      console.log(`반려동물 ${petId} 삭제 성공`);
      queryClient.invalidateQueries(["pets"]); // 반려동물 목록 새로고침
      alert("반려동물이 성공적으로 삭제되었습니다!");
    },
    onError: (error: unknown, petId, context) => {
      if (error instanceof Error) {
        console.error("반려동물 삭제 실패:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("반려동물 삭제에 실패했습니다.");

      // 에러 발생 시 원래 데이터 복원
      if (context?.previousPets) {
        queryClient.setQueryData(["pets"], context.previousPets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["pets"]); // 최종적으로 서버 데이터 동기화
    },
  });
};
