import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateSingleScheduleDTO {
  id: number;
  petId: number | null;
  name: string;
  startDatetime: string;
  endDatetime: string;
  petName: string;
}

// 스케줄 업데이트 API 호출 함수
const fetchUpdateSingleSchedule = async (updateData: UpdateSingleScheduleDTO): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  // 양쪽 따옴표 제거
  const cleanedToken = token.replace(/^"(.*)"$/, "$1");

  await axios.put(
    `http://localhost:8080/api/singleSchedule/${updateData.id}`,
    updateData,
    {
      headers: {
        Authorization: `Bearer ${cleanedToken}`,
      },
    }
  );
};

// React Query 훅 생성
export const useUpdateSingleSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchUpdateSingleSchedule,
    onSuccess: () => {
      // 스케줄 데이터 쿼리 무효화
      queryClient.invalidateQueries(["singleSchedules"]);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("스케줄 수정 실패:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("스케줄 수정에 실패했습니다.");
    },
  });
};
