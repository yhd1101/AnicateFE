import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 채팅방 퇴장 및 삭제 API 호출 함수
const exitChatRoom = async (roomId: string): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"|"$/g, ""); // 따옴표 제거

  await axios.delete(`http://localhost:8080/api/user/chat/rooms/${roomId}/exit`, {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
    },
  });
};

// ✅ React Query `useMutation` 훅
export const useExitChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: exitChatRoom, // ✅ API 호출 함수 연결
    onSuccess: (_, roomId) => {
      console.log(`채팅방 ${roomId} 삭제 성공`);

      // ✅ 삭제 후 채팅방 목록 새로고침
      queryClient.invalidateQueries(["chatRooms"]);
    },
    onError: (error) => {
      console.error("채팅방 삭제 실패:", error);
      alert("채팅방 삭제 중 오류가 발생했습니다.");
    },
  });
};
