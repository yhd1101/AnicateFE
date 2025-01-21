import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 삭제 API 호출 함수
const deletePeriodicSchedule = async (scheduleId: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/periodicSchedule/${scheduleId}`);
};

// React Query의 useMutation 훅 생성
export const useDeletePeriodicScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deletePeriodicSchedule,
    onSuccess: (_, scheduleId) => {
        console.log("삭제 성공:", scheduleId);
      
        // 캐시 수동 업데이트
        queryClient.setQueryData<any[]>(
          ["singleSchedules"],
          (oldData = []) => {
            if (Array.isArray(oldData)) {
              return oldData.filter((schedule) => schedule.id !== scheduleId);
            }
            return oldData;
          }
        );
      
        // 데이터 무효화로 새로고침
        queryClient.invalidateQueries(["singleSchedules"]);
      },
      
    onError: (error) => {
      console.error("삭제 실패:", error.message);
      alert(error.message || "삭제 중 오류가 발생했습니다.");
    },
  });
};
