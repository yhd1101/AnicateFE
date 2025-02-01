import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostData {
  id: number;
  title: string;
  content: string;
  animalSpecies: string;
  keyword: string;
  createdAt: string;
}

interface MetaData {
  page: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FetchPostsResponse {
  data: PostData[];
  meta: MetaData;
}

// ✅ 게시글 데이터를 불러오는 함수
const fetchPosts = async ({
  page,
  keyword = "",
}: {
  page: number;
  keyword?: string;
}): Promise<FetchPostsResponse> => {
  const response = await axios.get("http://localhost:8080/api/community", {
    params: {
      page,
      keyword, // ✅ keyword를 검색 파라미터로 추가
    },
  });

  return response.data.data; // ✅ 전체 데이터 반환
};

// ✅ React Query를 활용한 커스텀 훅
export const useFetchPosts = (page: number, keyword?: string) => {
  return useQuery({
    queryKey: ["posts", page, keyword], // ✅ queryKey에 keyword 추가
    queryFn: () => fetchPosts({ page, keyword }),
    staleTime: 1000 * 60, // ✅ 1분 동안 캐시 유지
  });
};
