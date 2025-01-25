import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface CreateAdminDTO {
  email: string;
  password: string;
  name: string;
}

interface AdminResponseDTO {
  email: string;
  name: string;
}

// 관리자 회원가입 API 호출 함수
const signupAdmin = async (
  adminData: CreateAdminDTO
): Promise<AdminResponseDTO> => {
  const response = await axios.post<AdminResponseDTO>(
    `http://localhost:8080/api/admin`,
    adminData, // 관리자 생성 데이터 전송
    {
      headers: {
        "Content-Type": "application/json", // JSON 데이터 전송
      },
    }
  );

  return response.data; // 서버에서 반환한 AdminResponseDTO 반환
};

// React Query의 useMutation 훅 생성
export const useAdminSignupMutation = () => {
  return useMutation<AdminResponseDTO, Error, CreateAdminDTO>({
    mutationFn: signupAdmin, // 호출 함수
    onSuccess: (data) => {
      console.log("관리자 회원가입 성공:", data);

    },
    onError: (error) => {
      alert(error.message || "회원가입 요청에 실패했습니다.");
    },
  });
};
