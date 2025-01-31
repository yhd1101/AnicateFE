import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ 채팅방 생성 요청 DTO
interface ChatRoomCreateRequestDTO {
  roomName: string;
  description: string;
}

// ✅ 채팅방 생성 응답 DTO
interface ChatRoomResponseDTO {
  roomId: string;
  roomName: string;
  description: string;
  occupied: boolean;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  opponentId: number | null;
  opponentName: string;
  opponentProfileImage: string | null;
  opponentStatus: string;
}

// ✅ 채팅방 생성 API 함수
const createChatRoom = async (requestData: ChatRoomCreateRequestDTO): Promise<ChatRoomResponseDTO> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/"/g, "");
  const response = await axios.post<ChatRoomResponseDTO>(
    `http://localhost:8080/api/user/chat/rooms`,
    requestData,
    {
      headers: {
        Authorization: `Bearer ${sanitizedToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ✅ React Query의 useMutation 훅 (chatList 즉시 반영)
export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient(); // 🔥 React Query 캐시 관리

  return useMutation<ChatRoomResponseDTO, Error, ChatRoomCreateRequestDTO>({
    mutationFn: createChatRoom,
    onSuccess: (data) => {
      console.log("채팅방 생성 성공:", data);

      // ✅ chatRooms 리스트 캐시 무효화 → 자동 리패치
      queryClient.invalidateQueries(["chatRooms"]);
    },
    onError: (error) => {
      alert(error.message || "채팅방 생성에 실패했습니다.");
    },
  });
};
