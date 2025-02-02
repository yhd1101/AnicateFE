import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRecoilState } from "recoil";
import { periodicModalState } from "@/recoil/atoms/loginState";
import { useAddPeriodicScheduleMutation } from "@/services/useAddPeriodicScheduleMutation";
import { usePeriodicScheduleQuery } from "@/services/usePeriodicGet";
import { useDeletePeriodicScheduleMutation } from "@/services/usePeriodicScheduleDelete";
import { useQueryClient } from "@tanstack/react-query";

export const PeriodicModal = ({petData}) => {
  const queryClient = useQueryClient();
  const { mutate: addSchedule } = useAddPeriodicScheduleMutation();
  const { mutate: deleteSchedule } = useDeletePeriodicScheduleMutation(); 
  const [isModalOpen, setIsModalOpen] = useRecoilState(periodicModalState);
  const [scheduleInput, setScheduleInput] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [startMinute, setStartMinute] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [endMinute, setEndMinute] = useState<number | null>(null);
  const [repeatType, setRepeatType] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [repeatDays, setRepeatDays] = useState<string[]>([]);


  const safePetData = petData?.data ?? []; // petData?.data가 없으면 빈 배열 사용
const [selectedPetId, setSelectedPetId] = useState<number | null>(
  safePetData.length > 0 ? safePetData[0].id : null // 첫 번째 펫의 ID를 기본값으로 설정
);
  const { data: periodicSchedules } = usePeriodicScheduleQuery();
  

  const handleDeleteSchedule = (scheduleId: number) => {
    // 삭제 API 호출
    deleteSchedule(scheduleId, {
      onSuccess: () => {
        alert("삭제 성공!");
      },
      onError: (error) => {
        alert(`삭제 실패: ${error.message}`);
      },
    });
  };
  

  // 스케줄 추가 핸들러
  const handleAddSchedule = () => {
    if (
      !scheduleInput ||
      !startDate ||
      !endDate ||
      startHour === null ||
      startMinute === null ||
      endHour === null ||
      endMinute === null ||
      (repeatType === "WEEKLY" && (!repeatInterval || repeatDays.length === 0))
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formatDateToLocalString = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

    // 스케줄 생성 페이로드
    const schedulePayload = {
        petId: selectedPetId,
        name: scheduleInput,
        startDate: startDate ? formatDateToLocalString(startDate) : "",
        endDate: endDate ? formatDateToLocalString(endDate) : "",
        startTime: `${startHour?.toString().padStart(2, "0")}:${startMinute
        ?.toString()
        .padStart(2, "0")}:00`,
        endTime: `${endHour?.toString().padStart(2, "0")}:${endMinute
        ?.toString()
        .padStart(2, "0")}:00`,
        repeatPattern: repeatType,
        repeatInterval: repeatType === "WEEKLY" ? parseInt(repeatInterval, 10) : 1,
        repeatDays: repeatType === "WEEKLY" ? repeatDays.join(",") : null,
    };

     // 콘솔에 입력 데이터 출력
    console.log("스케쥴 생성 요청 데이터:", schedulePayload);
    queryClient.invalidateQueries(["singleSchedules"]);
    alert("스케쥴이 생성되었습니다.")

    // API 호출
    addSchedule(schedulePayload, {
      onSuccess: () => {
        setIsModalOpen({ isModalOpen: false });
        resetFields();
      },
      onError: (error) => {
        alert(`스케쥴 생성 실패: ${error.message}`);
      },
    });
  };

  // 입력 필드 초기화
  const resetFields = () => {
    setScheduleInput("");
    setStartDate(null);
    setEndDate(null);
    setStartHour(null);
    setStartMinute(null);
    setEndHour(null);
    setEndMinute(null);
    setRepeatInterval("");
    setRepeatDays([]);
    setSelectedDay("");
  };

  // 시간 옵션 생성
  const generateTimeOptions = (range: number, startFrom: number | null = null) => {
    return Array.from({ length: range }, (_, i) => i).filter(
      (value) => startFrom === null || value >= startFrom
    );
  };

  // 요일 추가 핸들러
  const handleAddDay = () => {
    if (selectedDay && !repeatDays.includes(selectedDay)) {
      setRepeatDays((prev) => [...prev, selectedDay]);
      setSelectedDay("");
    }
  };

  // 요일 삭제 핸들러
  const handleRemoveDay = (day: string) => {
    setRepeatDays((prev) => prev.filter((d) => d !== day));
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isModalOpen.isModalOpen}
      onRequestClose={() => setIsModalOpen({ isModalOpen: false })}
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          backgroundColor: "#F6F8F1",
          width: "450px",  // 🔥 고정된 넓이
          height: "700px", // 🔥 고정된 높이
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <h2 className="text-xl font-semibold mb-4">정기 일정 생성</h2>
      <select
  value={selectedPetId ?? ""}
  onChange={(e) => setSelectedPetId(Number(e.target.value))}
  className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
>
  <option value="">펫 선택</option>
  {safePetData.map((pet) => (
    <option key={pet.id} value={pet.id}>
      {pet.name}
    </option>
  ))}
</select>

      {/* 스케쥴 입력 */}
      <input
        type="text"
        value={scheduleInput}
        onChange={(e) => setScheduleInput(e.target.value)}
        placeholder="스케쥴 입력"
        className="w-full border-b-2 border-gray-300 py-1 mb-4 outline-none focus:border-green-500"
      />
      

      {/* 날짜 선택 */}
      <div className="flex items-center gap-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="시작 날짜 선택"
          className="w-full border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
        />
        <span>~</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="종료 날짜 선택"
          className="w-full border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
          dateFormat="yyyy/MM/dd"
          minDate={startDate || new Date()}
        />
      </div>

      {/* 시간 선택 */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={startHour ?? ""}
          onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
          className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
        >
          <option value="">시작 시</option>
          {generateTimeOptions(24).map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        :
        <select
          value={startMinute ?? ""}
          onChange={(e) => setStartMinute(parseInt(e.target.value, 10))}
          className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
        >
          <option value="">시작 분</option>
          {generateTimeOptions(60).map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span>~</span>
        <select
          value={endHour ?? ""}
          onChange={(e) => setEndHour(parseInt(e.target.value, 10))}
          className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
        >
          <option value="">종료 시</option>
          {generateTimeOptions(24, startHour).map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        :
        <select
          value={endMinute ?? ""}
          onChange={(e) => setEndMinute(parseInt(e.target.value, 10))}
          className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
        >
          <option value="">종료 분</option>
          {generateTimeOptions(60).map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>

      {/* 반복 주기 선택 */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setRepeatType("DAILY")}
          className={`px-4 py-2 rounded-md ${
            repeatType === "DAILY" ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          DAILY
        </button>
        <button
          onClick={() => setRepeatType("WEEKLY")}
          className={`px-4 py-2 rounded-md ${
            repeatType === "WEEKLY" ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          WEEKLY
        </button>
      </div>

      {/* WEEKLY: 반복 간격 및 요일 */}
      {repeatType === "WEEKLY" && (
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
            placeholder="반복 간격 (숫자)"
            className="w-full border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
          />
          <div className="flex items-center gap-4">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border-b-2 border-gray-300 py-1 outline-none focus:border-green-500"
            >
              <option value="">요일 선택</option>
              {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddDay}
              className="px-4 py-1 bg-green-500 text-white rounded-md"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {repeatDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md"
              >
                {day}
                <button
                  onClick={() => handleRemoveDay(day)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddSchedule}
        className="w-full bg-green-500 text-white py-2 rounded-md"
      >
        스케쥴 생성
      </button>

      <hr className="border-t-2 border-gray-300 my-4" />

{/* 데이터 테이블 */}
        <h3 className="text-lg font-semibold mb-2">등록된 스케쥴</h3>
        <div className="overflow-y-auto max-h-48 border border-gray-300">
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="border border-gray-300 ">이름</th>
                <th className="border border-gray-300 px-4 py-2">스케줄</th>
                <th className="border border-gray-300 px-4 py-2">시작 날짜</th>
                <th className="border border-gray-300 px-4 py-2">종료 날짜</th>
                {/* <th className="border border-gray-300 px-4 py-2">액션</th> */}
            </tr>
            </thead>
            <tbody>
            {periodicSchedules?.data &&
                periodicSchedules.data.map((schedule, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{schedule.petName}</td>
                    <td className="border border-gray-300 px-4 py-2">{schedule.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{schedule.startDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{schedule.endDate}</td>
                    <td className="border border-gray-300 px-4 py-2">
                    <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteSchedule(schedule.id)} 
                    >
                        x
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>

       
    </Modal>
  );
};
