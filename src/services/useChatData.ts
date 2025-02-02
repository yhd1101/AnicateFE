import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// DTO 타입 정의
export interface ChatRoomResponseDTO {
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
}

interface MetaData {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FetchChatRoomsResponse {
  data: ChatRoomResponseDTO[];
  meta: MetaData;
}

// ✅ API 요청 함수 (fetchChatRooms)
const fetchChatRooms = async ({
  pageParam = 1,
  keyword = "",
  animalSpecies = "",
  sortBy = "createdAt",
}: {
  pageParam: number;
  keyword: string;
  animalSpecies: string;
  sortBy?: string;
}): Promise<FetchChatRoomsResponse> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/"/g, "");

  const response = await axios.get("http://localhost:8080/api/user/chat/rooms", {
    headers: {
      Authorization: `Bearer ${sanitizedToken}`,
    },
    params: {
      page: pageParam,
      keyword,
      animalSpecies,
      sortBy,
    },
  });

  console.log("ressd", response.data);
  return response.data; // ✅ data 안에 { data, meta } 포함됨
};

// ✅ React Query 훅 (useChatQuery)
export const useChatQuery = (page: number, keyword: string, animalSpecies: string, sortBy: string = "createdAt") => {
  return useQuery({
    queryKey: ["chatRooms", page, keyword, animalSpecies, sortBy],
    queryFn: () => fetchChatRooms({ pageParam: page, keyword, animalSpecies, sortBy }),
    staleTime: 1000 * 60 * 5, // 데이터 신선도 유지 시간
    retry: 2, // 요청 실패 시 2번 재시도
  });
};
