import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { periodicModalState, scheduleModalState, singleScheduleModalState } from "@/recoil/atoms/loginState";
import { useSingleScheduleQuery } from "@/services/useScheduleData";
import { usePetQuery } from "@/services/usePetQuery";
import axios from "axios";
import { PeriodicModal } from "./PeriodicModal";
import { useUpdateSingleSchedule } from "@/services/useUpdateSingleSchedule";
import { useDeleteSingleSchedule } from "@/services/useDeleteSingleSchedule";
import ScheduleModal from "./ScheduleModal";
import { useQueryClient } from "@tanstack/react-query";

export const BigCalendar: React.FC = () => {
  const { data, isLoading, error } = useSingleScheduleQuery();

  console.log(data,"sdsd213");
  const userId = sessionStorage.getItem("id");

  const { data: petData, error: petError, isLoading: petIsLoading } = usePetQuery(Number(userId));
  const queryClient = useQueryClient();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Map<string, string[]>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useRecoilState(singleScheduleModalState);
  const [schedulesForCalendar, setSchedulesForCalendar] = useState<Map<string, string[]>>(new Map());
  const [schedulesForModalWithId, setSchedulesForModalWithId] = useState<Map<string, string[]>>(new Map());
  const [schedulesForModal, setSchedulesForModal] = useState<Map<string, string[]>>(new Map());
  const [, setPeriodicModalState] = useRecoilState(periodicModalState);

  const closeScheduleModal = () => {
    setIsModalOpen({ isModalOpen: false });
  };

  const deleteSingleSchedule = useDeleteSingleSchedule();

  const handleLoginClick = () => {
    setPeriodicModalState({ isModalOpen: true });
  };

  const [editingSchedule, setEditingSchedule] = useState<{
    index: number;
    name: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [selectedPetName, setSelectedPetName] = useState<string | null>(null);

  const updateSchedule = useUpdateSingleSchedule();

  const addSchedule = async (scheduleData: {
    petId: number;
    petName: string;
    name: string;
    startDatetime: string;
    endDatetime: string;
  }) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("인증 토큰이 없습니다. 다시 로그인 해주세요.");
        return;
      }

      const cleanedToken = token.replace(/^"(.*)"$/, "$1");

      const response = await axios.post("http://localhost:8080/api/singleSchedule", scheduleData, {
        headers: {
          Authorization: `Bearer ${cleanedToken}`,
        },
      });

      console.log("스케줄 등록 성공:", response.data);
      queryClient.invalidateQueries(["singleSchedules"]);

      alert("스케줄이 성공적으로 추가되었습니다!");
    } catch (error) {
      console.error("스케줄 등록 실패:", error);
      alert("스케줄 추가 중 문제가 발생했습니다.");
    }
  };

  const padToTwoDigits = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const handleAddSchedule = () => {
    if (!selectedDate || !selectedPetId || !selectedPetName) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const startHour = document.querySelector<HTMLSelectElement>("select.start-hour")?.value;
    const startMinute = document.querySelector<HTMLSelectElement>("select.start-minute")?.value;
    const endHour = document.querySelector<HTMLSelectElement>("select.end-hour")?.value;
    const endMinute = document.querySelector<HTMLSelectElement>("select.end-minute")?.value;

    const startDatetime = `${selectedDate}T${padToTwoDigits(Number(startHour))}:${padToTwoDigits(Number(startMinute))}:00Z`;
    const endDatetime = `${selectedDate}T${padToTwoDigits(Number(endHour))}:${padToTwoDigits(Number(endMinute))}:00Z`;

    const scheduleData = {
      petId: selectedPetId,
      petName: selectedPetName,
      name: document.querySelector<HTMLInputElement>("input")?.value || "",
      startDatetime,
      endDatetime,
    };

    console.log(scheduleData,"아이시발");

    addSchedule(scheduleData);
  };

  const handleEdit = (index: number, schedule: string) => {
    const match = schedule.match(/^\s*(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})\s+(.+)$/);
    if (!match) {
      console.error("Invalid schedule format:", schedule);
      return;
    }

    const [, startTime, endTime, name] = match;
    setEditingSchedule({
      index,
      name,
      startTime,
      endTime,
    });
  };

  useEffect(() => {
    if (data) {
      const loadedSchedulesForModal = new Map<string, string[]>();
      const loadedSchedulesForCalendar = new Map<string, string[]>();
      const loadedSchedulesWithId = new Map<string, string[]>();

      data.forEach((item) => {
        const date = new Date(item.startDatetime)
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, "")
          .trim()
          .replace(/\s/g, "-");

        const startTime = new Date(item.startDatetime).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const endTime = new Date(item.endDatetime).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const modalScheduleText = `${startTime} ~ ${endTime} ${item.name}`;
        const modalScheduleTextWithId = `${modalScheduleText} (ID: ${item.id})  (Pet: ${item.petId})`;

        if (loadedSchedulesForModal.has(date)) {
          loadedSchedulesForModal.get(date)!.push(modalScheduleText);
          loadedSchedulesWithId.get(date)!.push(modalScheduleTextWithId);
        } else {
          loadedSchedulesForModal.set(date, [modalScheduleText]);
          loadedSchedulesWithId.set(date, [modalScheduleTextWithId]);
        }

        const calendarScheduleText = item.name;
        if (loadedSchedulesForCalendar.has(date)) {
          loadedSchedulesForCalendar.get(date)!.push(calendarScheduleText);
        } else {
          loadedSchedulesForCalendar.set(date, [calendarScheduleText]);
        }
      });

      setSchedulesForCalendar(loadedSchedulesForCalendar);
      setSchedulesForModal(loadedSchedulesForModal);
      setSchedulesForModalWithId(loadedSchedulesWithId);
    }
  }, [data]);

  const handleSaveEdit = (index: number) => {
    if (!editingSchedule || !schedulesForModal.has(selectedDate!)) return;

    const scheduleList = schedulesForModalWithId.get(selectedDate!)!;
    const originalSchedule = scheduleList[index];

    const match = originalSchedule.match(/ID: (\d+)/);
    const id = match ? Number(match[1]) : null;

    const petIdMatch = originalSchedule.match(/Pet: (\d+)/);
    const petId = petIdMatch ? Number(petIdMatch[1]) : null;

    if (!id) {
      console.error("스케줄 ID를 찾을 수 없습니다:", originalSchedule);
      return;
    }

    const timeMatch = originalSchedule.match(/(\d{2}:\d{2}) ~ (\d{2}:\d{2}) (.+) \(ID:/);
    if (!timeMatch) {
      console.error("스케줄 데이터 형식이 올바르지 않습니다:", originalSchedule);
      return;
    }

    const [, startTime, endTime, name] = timeMatch;

    const updateData = {
      id: id,
      petId: petId,
      name: editingSchedule.name || name,
      startDatetime: `${selectedDate}T${editingSchedule.startTime || startTime}:00Z`,
      endDatetime: `${selectedDate}T${editingSchedule.endTime || endTime}:00Z`,
      petName: selectedPetName || "",
    };

    updateSchedule.mutate(updateData, {
      onSuccess: () => {
        setEditingSchedule(null);
        alert("스케줄이 성공적으로 수정되었습니다.");
      },
      onError: (error) => {
        console.error("스케줄 수정 중 오류:", error);
      },
    });
  };

  const deleteSchedule = (index: number) => {
    if (!schedulesForModalWithId.has(selectedDate!)) return;

    const scheduleList = schedulesForModalWithId.get(selectedDate!)!;
    const originalSchedule = scheduleList[index];

    const idMatch = originalSchedule.match(/ID: (\d+)/);
    const id = idMatch ? Number(idMatch[1]) : null;

    if (!id) {
      console.error("스케줄 ID를 찾을 수 없습니다:", originalSchedule);
      return;
    }

    deleteSingleSchedule.mutate(id, {
      onSuccess: () => {
        setSchedulesForModalWithId((prevSchedules) => {
          const updatedSchedules = new Map(prevSchedules);
          const currentSchedules = updatedSchedules.get(selectedDate!)?.filter((_, i) => i !== index) || [];
          updatedSchedules.set(selectedDate!, currentSchedules);
          return updatedSchedules;
        });
        queryClient.invalidateQueries(["singleSchedules"]);
  
      },
      onError: (error) => {
        console.error("스케줄 삭제 중 오류:", error);
      },
    });
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const calendar: (string | null)[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendar.push((daysInPreviousMonth - i).toString());
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(i.toString());
    }
    const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();
    const extraDays = 6 - lastDayOfWeek;
    for (let i = 1; i <= extraDays; i++) {
      calendar.push(`${i}`);
    }

    const weeks: (string | null)[][] = [];
    while (calendar.length) {
      weeks.push(calendar.splice(0, 7));
    }

    return weeks;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const openScheduleList = (date: string) => {
    setSelectedDate(date);
  };

  const openScheduleModal = () => {
    setIsModalOpen({ isModalOpen: true });
    closeScheduleList();
  };

  const extractIdFromScheduleText = (scheduleText: string): number | null => {
    const match = scheduleText.match(/\(ID: (\d+)\)/);
    return match ? Number(match[1]) : null;
  };

  const closeScheduleList = () => {
    setSelectedDate(null);
    setEditingSchedule(null);
  };

  const renderCalendar = () => {
    const weeks = generateCalendar();

    return weeks.map((week, index) => (
      <div key={index} className="flex">
        {week.map((day, dayIndex) => {
          const dayNumber = parseInt(day, 10);
          const isNextMonth = day && dayNumber < 7 && index === weeks.length - 1;
          const isPreviousMonth = day && index === 0 && dayNumber > 20;
          const isCurrentMonth = !isPreviousMonth && !isNextMonth;

          const formattedDate = isCurrentMonth
            ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${day.padStart(2, "0")}`
            : null;

          return (
            <div
  key={dayIndex}
  className={`w-16 h-16 sm:w-28 sm:h-28 border border-gray-300 flex items-center relative p-2 sm:p-4 ${
    isNextMonth ? "bg-blue-200 text-gray-500" : isPreviousMonth ? "bg-gray-200" : "bg-white"
  }`}
  onClick={() => isCurrentMonth && formattedDate && openScheduleList(formattedDate)}
>
  <div className="relative w-full h-full flex flex-col items-start">
    {/* 날짜 글씨 크기 조정 */}
    <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold">{day}</span>

    {isCurrentMonth && formattedDate && schedulesForCalendar.has(formattedDate) ? (
      <ul className="mt-1 space-y-1">
        {schedulesForCalendar.get(formattedDate)!.slice(0, 2).map((schedule, idx) => (
          <li 
            key={idx} 
            className="text-[8px] sm:text-xs md:text-sm lg:text-base text-[#5CA157] truncate"
          >
            {schedule.length > 6 ? `${schedule.slice(0, 6)}...` : schedule}
          </li>
        ))}

        {schedulesForCalendar.get(formattedDate)!.length > 2 && (
          <li 
            className="text-[8px] sm:text-xs md:text-sm lg:text-base text-blue-500 cursor-pointer"
            onClick={() => openScheduleList(formattedDate)}
          >
            ...더보기
          </li>
        )}
      </ul>
    ) : (
      <span className="text-[8px] sm:text-xs md:text-sm lg:text-base mt-1">일정 없음</span>
    )}
  </div>
</div>

          );
        })}
      </div>
    ));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="px-2 py-1 sm:px-4 sm:py-2 bg-[#5CA157] text-white rounded-md">
              &#8592; 이전 달
            </button>
            <button onClick={handleNextMonth} className="px-2 py-1 sm:px-4 sm:py-2 bg-[#5CA157] text-white rounded-md">
              다음 달 &#8594;
            </button>
          </div>

          <span className="font-bold text-lg sm:text-xl">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</span>

          <button onClick={handleLoginClick} className="px-2 py-1 sm:px-4 sm:py-2 bg-[#5CA157] text-white rounded-md">
            정기 일정
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          <div className="text-center text-sm sm:text-lg">일</div>
          <div className="text-center text-sm sm:text-lg">월</div>
          <div className="text-center text-sm sm:text-lg">화</div>
          <div className="text-center text-sm sm:text-lg">수</div>
          <div className="text-center text-sm sm:text-lg">목</div>
          <div className="text-center text-sm sm:text-lg">금</div>
          <div className="text-center text-sm sm:text-lg">토</div>
        </div>
        <div className="mt-4" style={{ height: "auto" }}>
          {renderCalendar()}
        </div>
      </div>

      <PeriodicModal petData={petData} />

      {selectedDate && (
        <ScheduleModal
          selectedDate={selectedDate}
          schedulesForModal={schedulesForModal}
          editingSchedule={editingSchedule}
          setEditingSchedule={setEditingSchedule}
          handleSaveEdit={handleSaveEdit}
          deleteSchedule={deleteSchedule}
          handleAddSchedule={handleAddSchedule}
          closeScheduleList={closeScheduleList}
          handleEdit={handleEdit}
          petData={petData}
          setSelectedPetId={setSelectedPetId}
          setSelectedPetName={setSelectedPetName}
        />
      )}
    </div>
  );
};

export default BigCalendar;