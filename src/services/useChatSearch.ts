import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChatRoomResponseDTO, MetaData } from "./types";

interface FetchChatRoomsResponse {
  data: ChatRoomResponseDTO[];
  meta: MetaData;
}

// ✅ API 요청 함수 (검색 전용)
const fetchSearchChatRooms = async ({
  page,
  keyword,
}: {
  page: number;
  keyword: string;
}): Promise<FetchChatRoomsResponse> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/"/g, "");

  const response = await axios.get("http://localhost:8080/api/user/chat/rooms/search", {
    headers: { Authorization: `Bearer ${sanitizedToken}` },
    params: { page, keyword },
  });

  return response.data;
};

// ✅ React Query 훅 (검색 전용)
export const useSearchChatQuery = (page: number, keyword: string) => {
  return useQuery({
    queryKey: ["searchChatRooms", page, keyword],
    queryFn: () => fetchSearchChatRooms({ page, keyword }),
    staleTime: 1000 * 60 * 5,
  });
};
