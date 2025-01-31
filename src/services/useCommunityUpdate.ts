import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 댓글 수정 API 호출 함수
const updateComment = async ({ commentId, content }: { commentId: number; content: string }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  const response = await axios.put(
    `http://localhost:8080/api/comments/${commentId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${sanitizedToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ✅ React Query `useMutation` 훅
export const useUpdateCommentMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      console.log("댓글 수정 성공:", updatedComment);

      // ✅ React Query 캐시 업데이트 (새로고침 없이 반영)
      queryClient.setQueryData(["communityDetail", id], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
      
        return {
          ...oldData,
          data: {
            ...oldData.data,
            comment: oldData.data.comment.map((comment: any) =>
              comment.id === updatedComment.id
                ? { ...comment, content: updatedComment.content, updatedAt: new Date().toISOString() }
                : comment
            ),
          },
        };
      });
      
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    },
  });
};
