import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostData {
  id: number;
  userId: number;
  title: string;
  content: string;
  picture: string;
  animalSpecies: string;
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
  animalSpecies = "",
}: {
  pageParam: number;
  keyword: string;
  animalSpecies: string;
}): Promise<FetchCommunityResponse> => {
  const response = await axios.get("http://localhost:8080/api/community", {
    params: {
      page: pageParam,
      keyword,
      animalSpecies,
    },
  });
  return response.data.data;
};

export const useFetchCommunity = (page: number, keyword: string, animalSpecies: string) => {
  return useQuery({
    queryKey: ["community", page, keyword, animalSpecies],
    queryFn: () => fetchCommunity({ pageParam: page, keyword, animalSpecies }),
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
