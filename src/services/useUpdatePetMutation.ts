import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdatePetParams {
  petId: number;
  speciesId: number;
  breedId: number;
  name: string;
  age?: string;
  gender: "암컷" | "수컷";
  file?: File | null;
}

// ✅ 반려동물 수정 API 호출 함수
const updatePet = async ({ petId, speciesId, breedId, name, age, gender, file }: UpdatePetParams) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  const formData = new FormData();
  
  // DTO JSON 데이터 추가
  const dto = JSON.stringify({ id: petId, speciesId, breedId, name, age, gender });
  formData.append("dto", new Blob([dto], { type: "application/json" }));

  // 파일 추가 (선택 사항)
  if (file) {
    formData.append("file", file);
  }

  const response = await axios.put(`http://localhost:8080/api/pet/${petId}`, formData, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ React Query `useMutation` 훅
export const useUpdatePetMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePet,
    onSuccess: (updatedPet) => {
      console.log("반려동물 수정 성공:", updatedPet);

      // ✅ React Query 캐시 업데이트 (새로고침 없이 UI 반영)
      queryClient.setQueryData(["pets", userId], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
      
        return {
          ...oldData,
          data: oldData.data.map((pet: any) =>
            pet.id === updatedPet.id ? { ...pet, ...updatedPet } : pet
          ),
        };
      });

      alert("반려동물 정보가 성공적으로 수정되었습니다!");
    },
    onError: (error) => {
      console.error("반려동물 수정 실패:", error);
      alert("반려동물 수정 중 오류가 발생했습니다.");
    },
  });
};
