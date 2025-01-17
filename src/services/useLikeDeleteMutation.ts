import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LikeDeleteResponseDTO {
  success: boolean;
}

// 좋아요 삭제 API 호출 함수
const deleteLike = async (postingId: string): Promise<LikeDeleteResponseDTO> => {
  const token = sessionStorage.getItem("token"); // 세션에서 토큰 가져오기
  if (!token) {
    throw new Error("로그인이 필요합니다."); // 로그인 필수
  }

  const sanitizedToken = token.replace(/"/g, ""); // 토큰에서 따옴표 제거
  const response = await axios.delete<LikeDeleteResponseDTO>(
    `http://localhost:8080/api/like/${postingId}`,
    {
      headers: {
        Authorization: `Bearer ${sanitizedToken}`, // Authorization 헤더에 토큰 추가
      },
    }
  );

  return response.data; // 서버에서 반환한 LikeDeleteResponseDTO 반환
};

// React Query의 useMutation 훅 생성
export const useLikeDeleteMutation = () => {
  return useMutation<LikeDeleteResponseDTO, Error, string>({
    mutationFn: deleteLike, // 호출 함수
    onSuccess: () => {
      alert("좋아요 삭제 성공!"); // 성공 알림
    },
    onError: (error) => {
      alert(
        error.message || "좋아요 삭제 요청에 실패했습니다."
      ); // 실패 알림
    },
  });
};
