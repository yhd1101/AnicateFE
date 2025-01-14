import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ChatRoomDTO {
  roomId: string;
  roomName: string;
  description: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  isOccupied: boolean;
}

// ChatRoom 데이터를 가져오는 함수
const fetchChatRoomData = async () => {
  const response = await axios.get(`http://localhost:8080/api/chat/rooms`);
  return response.data as ChatRoomDTO[]; // 채팅방 데이터 반환
};

// React Query 훅 생성
export const useChatQuery = () => {
  return useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRoomData,
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간 (1분)
  });
};
