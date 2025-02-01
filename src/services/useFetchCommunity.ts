import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostData {
  id: number;
  userId: number;
  title: string;
  content: string;
  picture: string;
  animalSpecies: string;
  commentCount: number;  
  likeCount: number
}

interface MetaData {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FetchCommunityResponse {
  data: PostData[];
  meta: MetaData;
}

const fetchCommunity = async ({
  pageParam = 1,
  keyword = "",
  animalSpecies= "",
  sortBy = "",
}: {
  pageParam: number;
  keyword: string;
  aniamlSpecies: string; // ✅ category 추가
  sortBy?: string;
}): Promise<FetchCommunityResponse> => {
  const response = await axios.get("http://localhost:8080/api/community", {
    params: {
      page: pageParam,
      keyword,
      animalSpecies, // ✅ 백엔드에서 category 파라미터를 찾을 수 없을 가능성 있음
      sortBy,
    },
  });
  return response.data.data;
};

export const useFetchCommunity = (page: number, keyword: string, animalSpecies: string, sortBy: string = "id") => {
  return useQuery({
    queryKey: ["community", page, keyword, animalSpecies, sortBy],
    queryFn: () => fetchCommunity({ pageParam: page, keyword, animalSpecies, sortBy }),
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
