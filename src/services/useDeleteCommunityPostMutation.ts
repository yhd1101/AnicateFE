import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 삭제 API 호출 함수
const deleteCommunityPost = async (postingId: number): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  await axios.delete(`http://localhost:8080/api/community/post/${postingId}`, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
    },
  });
};

// ✅ React Query `useMutation` 훅
export const useDeleteCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteCommunityPost, // ✅ API 호출 함수 연결
    onSuccess: (_, postingId) => {
      console.log(`게시글 ${postingId} 삭제 성공`);

      // ✅ 삭제 후 전체 커뮤니티 목록 새로고침
      queryClient.invalidateQueries(["community"]);
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    },
  });
};
