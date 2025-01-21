import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PeriodicScheduleDTO {
  id: number;
  userId: number;
  petId: number;
  petName: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  repeatPattern: "DAILY" | "WEEKLY";
  repeatInterval: number;
  repeatDays: string | null;
  createdAt: string;
  updatedAt: string;
}

// Periodic Schedules 데이터를 서버에서 가져오는 함수
const fetchPeriodicSchedules = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const cleanedToken = token.replace(/^"(.*)"$/, "$1"); // 양쪽 따옴표 제거

  const response = await axios.get<PeriodicScheduleDTO[]>(
    "http://localhost:8080/api/periodicSchedules",
    {
      headers: {
        Authorization: `Bearer ${cleanedToken}`,
      },
    }
  );

  return response.data; // 정기 일정 데이터 반환
};

// React Query 훅 생성
export const usePeriodicScheduleQuery = () => {
  return useQuery<PeriodicScheduleDTO[], Error>({
    queryKey: ["periodicSchedules"],
    queryFn: fetchPeriodicSchedules,
    staleTime: 1000 * 60, // 데이터 신선도 유지 시간 (1분)
  });
};
