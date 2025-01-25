import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// 로그인 요청에 필요한 데이터 타입
interface LoginAdminDTO {
  email: string;
  password: string;
}

// 로그인 응답 데이터 타입
interface LoginResponseDTO {
  accessToken: string;
  userId?: number; // userId를 선택적으로 변경
  role: string;
}

// 로그인 API 호출 함수
const loginAdmin = async (loginData: LoginAdminDTO): Promise<LoginResponseDTO> => {
  const response = await axios.post<LoginResponseDTO>(
    "http://localhost:8080/api/auth/login", // API URL
    loginData, // 로그인 데이터 전송
    {
      headers: {
        "Content-Type": "application/json", // JSON 데이터 전송
      },
    }
  );

  console.log("API 응답 데이터:", response.data?.data); // 디버깅용

  // userId가 누락된 경우 기본값 설정
  if (!response.data?.data.userId) {
    throw new Error("응답 데이터에 userId가 없습니다.");
  }

  return response.data?.data; // 응답 데이터 반환
};

// React Query의 useMutation 훅 생성
export const useAdminLoginMutation = () => {
  return useMutation<LoginResponseDTO, Error, LoginAdminDTO>({
    mutationFn: loginAdmin, // 호출 함수
    onSuccess: (data) => {
      console.log("로그인 성공:", data);

      // sessionStorage에 데이터 저장
      sessionStorage.setItem("token", data.accessToken);
      sessionStorage.setItem("id", data.userId?.toString() || ""); // userId가 없으면 빈 문자열
      sessionStorage.setItem("role", data.role);

      // sessionStorage에서 토큰 가져오기
      const token = sessionStorage.getItem("token");
      if (token) {
        console.log("토큰:", token); // JWT 토큰 출력
      } else {
        console.error("토큰이 없습니다.");
      }


      alert("로그인 성공!");
    },
    onError: (error) => {
      console.error("로그인 실패:", error.message);
      alert(error.message || "로그인 요청에 실패했습니다.");
    },
  });
};
