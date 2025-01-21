import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// DTO 정의
interface AddPeriodicScheduleRequest {
  petId: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  repeatPattern: "DAILY" | "WEEKLY";
  repeatInterval: number;
  repeatDays?: string | null;
}

interface PeriodicScheduleResponse {
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
  repeatDays?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API 호출 함수
const addPeriodicSchedule = async (
  schedule: AddPeriodicScheduleRequest
): Promise<PeriodicScheduleResponse> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const sanitizedToken = token.replace(/^"(.*)"$/, "$1");

  const response = await axios.post<PeriodicScheduleResponse>(
    "http://localhost:8080/api/periodicSchedule",
    schedule,
    {
      headers: {
        Authorization: `Bearer ${sanitizedToken}`,
      },
    }
  );

  return response.data;
};

// React Query의 useMutation 훅 생성
export const useAddPeriodicScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PeriodicScheduleResponse,
    Error,
    AddPeriodicScheduleRequest
  >({
    mutationFn: addPeriodicSchedule,
    onSuccess: (newSchedule) => {
      console.log("정기 일정 생성 성공:", newSchedule);

      // 캐시를 강제로 새로고침
      queryClient.invalidateQueries(["singleSchedules"]);

      // 혹은 수동으로 캐시 업데이트
      queryClient.setQueryData<PeriodicScheduleResponse[]>(
        ["singleSchedules"],
        (oldData = []) => {
          if (!Array.isArray(oldData)) {
            console.error("캐시 데이터가 배열이 아닙니다:", oldData);
            return [newSchedule]; // 기본값으로 새 데이터 추가
          }
          return [...oldData, newSchedule];
        }
      );
    },
    onError: (error) => {
      console.error("정기 일정 생성 실패:", error);
      alert("정기 일정 생성 중 오류가 발생했습니다.");
    },
  });
};

