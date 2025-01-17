import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LikeResponseDTO {
  id: number;
  communityId: number;
  userId: number;
}

// 좋아요 API 호출 함수
const likePost = async (postingId: string): Promise<LikeResponseDTO> => {
  const token = sessionStorage.getItem("token"); // 세션에서 토큰 가져오기
  if (!token) {
    throw new Error("로그인이 필요합니다."); // 로그인 필수
  }

  const sanitizedToken = token.replace(/"/g, ""); // 토큰에서 따옴표 제거
  const response = await axios.post<LikeResponseDTO>(
    `http://localhost:8080/api/like/${postingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${sanitizedToken}`,
      },
    }
  );

  return response.data; // 서버에서 반환한 LikeResponseDTO 반환
};

// React Query의 useMutation 훅 생성
export const useLikeMutation = () => {
  return useMutation<LikeResponseDTO, Error, string>({
    mutationFn: likePost, // 호출 함수
    onSuccess: (data) => {
      console.log("성공");
    },
    onError: (error) => {
      alert(
        error.message || "좋아요 요청에 실패했습니다."
      ); // 실패 알림
    },
  });
};
