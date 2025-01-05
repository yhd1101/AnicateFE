import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostData {
  id: number;
  speciesName:string;
  breedName: string;
  age: string;
  picture: string;
  weight: string;
  height: string;
  guide: string;
  description: string;
  hit: number;
}

interface MetaData {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FetchInformationResponse {
  data: PostData[];
  meta: MetaData;
}

const fetchInformation = async ({
  pageParam = 1,
  speciesName = "",
  breedName = "",
  sortBy = "",
}: {
  pageParam: number;
  speciesName: string;
  breedName: string;
  sortBy?: string; // 정렬 조건 추가
}): Promise<FetchInformationResponse> => {
  const response = await axios.get("http://localhost:8080/api/information", {
    params: {
      page: pageParam,
      speciesName,
      breedName,
      sortBy, // 정렬 조건 추가
    },
  });
  return response.data.data;
};

export const useFetchInformation = (
  page: number,
  speciesName: string,
  breedName: string,
  sortBy: string = "id"
) => {
  return useQuery({
    queryKey: ["information", page, speciesName, breedName, sortBy],
    queryFn: () => fetchInformation({ pageParam: page, speciesName, breedName, sortBy }),
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
