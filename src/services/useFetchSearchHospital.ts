import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HospitalData {
  opnsfTeamCode: string;
  mgtNo: string;
  apvPermYmd: string;
  trdStateGbn: string;
  trdStateNm: string;
  siteTel: string;
  siteWhlAddr: string;
  rdnWhlAddr: string;
  bplcNm: string;
  uptaeNm: string;
  xCode: string;
  yCode: string;
  latitude: number;
  longitude: number;
}

interface FetchHospitalResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: HospitalData[];
}

// 병원 데이터를 가져오는 API 호출 함수
const fetchHospitals = async (gu: string, dong?: string): Promise<FetchHospitalResponse> => {
  const response = await axios.get("http://localhost:8080/api/animal-hospitals/dongorgu", {
    params: { gu, dong }, // gu와 dong 파라미터를 API에 전달
  });
  return response.data;
};

// React Query 훅
export const useFetchSearchHospital = (gu: string, dong?: string) => {
  return useQuery({
    queryKey: ["hospitals", gu, dong], // gu와 dong을 queryKey에 포함
    queryFn: () => fetchHospitals(gu, dong), // fetchHospitals 호출
    enabled: !!gu, // gu가 존재할 때 실행, dong은 선택적
    staleTime: 1000 * 60, // 1분 동안 데이터 신선도 유지
  });
};
