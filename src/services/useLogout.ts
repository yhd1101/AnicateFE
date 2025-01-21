import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 로그아웃 API 호출 함수
const fetchLogout = async (): Promise<string> => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  // 양쪽 따옴표 제거
  token = token.replace(/^"(.*)"$/, "$1");

  const { data } = await axios.get("http://localhost:8080/api/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`, // 헤더에 토큰 포함
    },
    withCredentials: true, // 쿠키 포함
  });

  return data;
};

// React Query 훅 생성
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // navigate 추가

  return useMutation({
    mutationFn: fetchLogout, // 로그아웃 API 함수
    onSuccess: (data) => {
      console.log("로그아웃 API 응답:", data);

      // 캐시 초기화
      queryClient.clear();

      // 세션 스토리지 초기화
      sessionStorage.clear();

      // 쿠키 초기화
      document.cookie = "REFRESHTOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 알림 및 페이지 이동
      alert("로그아웃 성공!");
      navigate("/"); // 루트 경로로 이동
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("로그아웃 실패:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("로그아웃에 실패했습니다.");
    },
  });
};
