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

// API 응답 타입 정의
interface informationResponse {
  statusCode: number;
  message: string;
  data: {
    data: PostData;
  };
}

// API 호출 함수
const fetchCommunityDetail = async (id: string): Promise<informationResponse> => {
  const response = await axios.get(`http://localhost:8080/api/information/${id}`);
  return response.data;
};

// useQuery 훅을 통해 API 데이터 가져오기
export const useFetchInformationDetail = (id: string) => {
  return useQuery<informationResponse, Error>({
    queryKey: ["informationDetail", id],
    queryFn: () => fetchCommunityDetail(id),
    enabled: !!id, // id가 있을 때만 API 호출
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간
  });
};
