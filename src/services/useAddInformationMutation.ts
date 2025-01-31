import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ DTO 정의
interface InformationRequestDTO {
  speciesName: string;
  breedName: string;
  age: string;
  weight: string;
  height: string;
  guide: string;
  description: string;
  file?: File | null;
}

// ✅ API 호출 함수
const addInformation = async (informationData: InformationRequestDTO): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"(.*)"$/, "$1");

  // ✅ FormData 생성
  const formData = new FormData();
  formData.append(
    "dto",
    new Blob([JSON.stringify(informationData)], {
      type: "application/json",
    })
  );

  if (informationData.file) {
    formData.append("file", informationData.file);
  }

  // ✅ API 요청
  await axios.post("http://localhost:8080/api/information", formData, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ React Query `useMutation` 훅 생성
export const useAddInformationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, InformationRequestDTO>({
    mutationFn: addInformation,
    onSuccess: () => {
      console.log("정보 등록 성공");

      // ✅ 캐시 무효화 → 정보 목록 자동 업데이트
      queryClient.invalidateQueries(["information"]);
    },
    onError: (error) => {
      console.error("정보 등록 실패:", error);
      alert(error.message || "정보 등록 중 오류가 발생했습니다.");
    },
  });
};
