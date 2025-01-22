import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 스케줄 삭제 API 호출 함수
const deleteSingleSchedule = async (scheduleId: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/singleSchedule/${scheduleId}`); // API 호출 (토큰 없이)
};

// React Query 훅 생성
export const useDeleteSingleSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSingleSchedule, // 삭제 API 호출 함수
    onSuccess: (_, scheduleId) => {
      console.log(`스케줄 ${scheduleId} 삭제 성공`);

      // 특정 스케줄 쿼리 제거
      queryClient.removeQueries(["singleSchedule", scheduleId]); // scheduleId와 연관된 데이터 삭제

      // 스케줄 목록 쿼리 무효화
      queryClient.invalidateQueries(["singleSchedules"]);

      alert("스케줄이 성공적으로 삭제되었습니다!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("스케줄 삭제 실패:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("스케줄 삭제에 실패했습니다.");
    },
  });
};
