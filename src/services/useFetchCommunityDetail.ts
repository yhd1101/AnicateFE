import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Community 상세 데이터 타입
interface PostData {
  id: number;
  userId: number;
  name: string;
  profileImg: string;
  title: string;
  content: string;
  picture: string;
  animalSpecies: string;
  commentCount: number;
  likeCount: number;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입 정의
interface CommunityResponse {
  statusCode: number;
  message: string;
  data: {
    community: PostData;
    comment: {
      data: any[];
    };
  };
}

// API 호출 함수
const fetchCommunityDetail = async (id: string): Promise<CommunityResponse> => {
  const response = await axios.get(`http://localhost:8080/api/community/${id}`);
  return response.data;
};

// useQuery 훅을 통해 API 데이터 가져오기
export const useFetchCommunityDetail = (id: string) => {
  return useQuery<CommunityResponse, Error>({
    queryKey: ["communityDetail", id],
    queryFn: () => fetchCommunityDetail(id),
    enabled: !!id, // id가 있을 때만 API 호출
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
