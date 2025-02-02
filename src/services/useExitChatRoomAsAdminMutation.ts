import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 관리자 채팅방 퇴장 API 호출 함수
const exitChatRoomAsAdmin = async (roomId: string): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  await axios.delete(`http://localhost:8080/api/admin/chat/rooms/${roomId}/exit`, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
    },
  });
};

// ✅ React Query `useMutation` 훅
export const useExitChatRoomAsAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: exitChatRoomAsAdmin, // ✅ API 호출 함수 연결
    onSuccess: (_, roomId) => {
      console.log(`관리자가 채팅방 ${roomId}을(를) 성공적으로 퇴장했습니다.`);

      // ✅ 채팅방 목록 새로고침
      queryClient.invalidateQueries(["adminChatRooms"]);
      alert("채팅방에서 성공적으로 퇴장했습니다!");
    },
    onError: (error) => {
      console.error("채팅방 퇴장 실패:", error);
      alert("채팅방 퇴장 중 오류가 발생했습니다.");
    },
  });
};
