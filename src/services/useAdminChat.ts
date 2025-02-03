import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// DTO 타입 정의
export interface ChatRoomResponseDTO {
  roomId: string; // 채팅방 ID
  roomName: string; // 채팅방 이름
  description: string; // 채팅방 설명
  occupied: boolean; // 관리자 참여 여부
  lastMessage: string; // 마지막 메시지
  lastMessageTime: string; // 마지막 메시지 시간
  createdAt: string; // 생성일
  opponentId: number | null; // 상대방 ID
  opponentName: string; // 상대방 이름
  opponentProfileImage: string | null; // 상대방 프로필 이미지
}

// 페이지 정보 DTO
export interface PageMetaDTO {
  currentPage: number; // 현재 페이지
  pageSize: number; // 페이지 크기
  totalElements: number; // 전체 요소 수
}

// 페이지 응답 DTO
export interface PageDTO<T> {
  content: T[]; // 데이터 내용
  meta: PageMetaDTO; // 메타 정보
}

// React Query 훅
export const useAdminChatQuery = (page: number, size: number) => {
  return useQuery<PageDTO<ChatRoomResponseDTO>, Error>({
    queryKey: ["adminChatRooms", page, size], // 캐시 키
    queryFn: async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const sanitizedToken = token.replace(/"/g, ""); // 토큰 정리
      const response = await axios.get<PageDTO<ChatRoomResponseDTO>>(
        "http://localhost:8080/api/admin/chat",
        {
          headers: {
            Authorization: `Bearer ${sanitizedToken}`,
          },
          params: { page, size }, // 페이지와 크기 전달
        }
      );

      return response.data; // PageDTO<ChatRoomResponseDTO> 데이터 반환
    },
    staleTime: 1000 * 60 * 5, // 데이터 신선도 유지 시간 (5분)
    retry: 2, // 실패 시 재시도 횟수
  });
};
