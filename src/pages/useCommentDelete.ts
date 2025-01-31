import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 댓글 삭제 API 호출 함수
const deleteComment = async (commentId: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
    },
  });
};

// ✅ React Query `useMutation` 훅
export const useDeleteCommentMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, commentId) => {
      console.log("댓글 삭제 성공:", commentId);

      // ✅ React Query 캐시 업데이트 (새로고침 없이 반영)
      queryClient.setQueryData(["communityDetail", id], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            comment: oldData.data.comment.filter((comment: any) => comment.id !== commentId),
            community: {
              ...oldData.data.community,
              commentCount: oldData.data.community.commentCount - 1, // 댓글 수 감소
            },
          },
        };
      });

      // ✅ 강제 데이터 다시 불러오기 (필요한 경우)
      queryClient.invalidateQueries(["communityDetail", id]);
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    },
  });
};
