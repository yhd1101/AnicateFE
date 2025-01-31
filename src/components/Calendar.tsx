import React, { useState } from "react";
import ScheduleModal from "./ScheduleModal"; 
import { usePetQuery } from "@/services/usePetQuery";
import { useUpdateSingleSchedule } from "@/services/useUpdateSingleSchedule";
import axios from "axios";

interface CalendarProps {
  reminderMessage: string;
  scheduleDates: string[];
  scheduleData?: { date: string; name: string }[];
}

const Calendar: React.FC<CalendarProps> = ({ reminderMessage, scheduleDates = [], scheduleData = [] }) => {
  console.log(scheduleData, "scales");

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    index: number;
    name: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const userId = sessionStorage.getItem("id");
  const padToTwoDigits = (num: number) => (num < 10 ? `0${num}` : `${num}`);



const updateSchedule = useUpdateSingleSchedule();
  const { data: petData } = usePetQuery(Number(userId));

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [selectedPetName, setSelectedPetName] = useState<string | null>(null);

  console.log("pets", petData);

  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate("");
  };

  const addSchedule = async (scheduleData: {
    petId: number;
    petName: string;
    name: string;
    startDatetime: string;
    endDatetime: string;
  }) => {
    try {
      // sessionStorage에서 토큰 가져오기
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('인증 토큰이 없습니다. 다시 로그인 해주세요.');
        return;
      }
  
      // 토큰에서 양쪽 따옴표 제거
      const cleanedToken = token.replace(/^"(.*)"$/, '$1');
  
      const response = await axios.post(
        'http://localhost:8080/api/singleSchedule',
        scheduleData,
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`, // Bearer 토큰 형식
          },
        }
      );
  
      console.log('스케줄 등록 성공:', response.data);
      alert('스케줄이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('스케줄 등록 실패:', error);
      alert('스케줄 추가 중 문제가 발생했습니다.');
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate("");
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-[40px] h-[40px]"></div>);
    }

    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isScheduled = scheduleDates.includes(dateString);
      const isToday = dateString === todayFormatted;
      const isSelected = dateString === selectedDate;

      let dayClass = "w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer";

      if (isSelected) {
        dayClass += " bg-[#007BFF] text-white";
      } else if (isToday) {
        dayClass += " bg-[#5CA157] text-white";
      } else if (isScheduled) {
        dayClass += " bg-[#FFA500] text-white";
      }

      days.push(
        <div
          key={i}
          className={dayClass}
          onClick={() => {
            setSelectedDate(dateString);
            setIsModalOpen(true);
          }}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const closeScheduleList = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };



  const handleSaveEdit = (index: number) => {
    if (!editingSchedule || !schedulesForModal.has(selectedDate!)) return;
  
    const scheduleList = schedulesForModalWithId.get(selectedDate!)!;
    console.log("s3csc" , scheduleList);
    const originalSchedule = scheduleList[index];
    console.log("orgs", originalSchedule);
  
    // 기존 스케줄에서 ID 추출
    const match = originalSchedule.match(/ID: (\d+)/);
    const id = match ? Number(match[1]) : null;
    console.log(typeof id , "sdasd");
  
    const petIdMatch = originalSchedule.match(/Pet: (\d+)/);
    const petId = petIdMatch ? Number(petIdMatch[1]) : null;
  
    if (!id) {
      console.error("스케줄 ID를 찾을 수 없습니다:", originalSchedule);
      return;
    }
  
    // 기존 스케줄 데이터를 추출
    const timeMatch = originalSchedule.match(/(\d{2}:\d{2}) ~ (\d{2}:\d{2}) (.+) \(ID:/);
    if (!timeMatch) {
      console.error("스케줄 데이터 형식이 올바르지 않습니다:", originalSchedule);
      return;
    }
    const [, startTime, endTime, name] = timeMatch;
    console.log("names" , name)
  
    // API 요청 데이터 구성
    const updateData = {
      id: id, // 추출된 스케줄 ID
      petId: petId, // 선택된 Pet ID
      name: editingSchedule.name || name, // 수정되지 않은 경우 기존 이름 사용
      startDatetime: `${selectedDate}T${editingSchedule.startTime || startTime}:00Z`,
      endDatetime: `${selectedDate}T${editingSchedule.endTime || endTime}:00Z`,
      petName: selectedPetName || "",
    };
  
    console.log("업데이트 데이터:", updateData);
  
    // 업데이트 API 호출
    updateSchedule.mutate(updateData, {
      onSuccess: () => {
        setEditingSchedule(null); // 수정 모드 종료
        alert("스케줄이 성공적으로 수정되었습니다.");
      },
      onError: (error) => {
        console.error("스케줄 수정 중 오류:", error);
      },
    });
  };

  const deleteSchedule = (index: number) => {
    console.log(`삭제된 일정: ${index}`);
  };

  const handleAddSchedule = () => {
    if (!selectedDate || !selectedPetId || !selectedPetName) {
      alert("모든 값을 입력해주세요.");
      return;
    }
  
    const startHour = document.querySelector<HTMLSelectElement>(
      "select.start-hour"
    )?.value;
    const startMinute = document.querySelector<HTMLSelectElement>(
      "select.start-minute"
    )?.value;
  
    const endHour = document.querySelector<HTMLSelectElement>(
      "select.end-hour"
    )?.value;
    const endMinute = document.querySelector<HTMLSelectElement>(
      "select.end-minute"
    )?.value;
  
    // Datetime 조합
    const startDatetime = `${selectedDate}T${padToTwoDigits(
      Number(startHour)
    )}:${padToTwoDigits(Number(startMinute))}:00Z`;
  
    const endDatetime = `${selectedDate}T${padToTwoDigits(
      Number(endHour)
    )}:${padToTwoDigits(Number(endMinute))}:00Z`;
  
  
    
  
    // 요청 데이터 생성
      const scheduleData = {
        petId: selectedPetId,
        petName: selectedPetName,
        name: document.querySelector<HTMLInputElement>("input")?.value || "",
        startDatetime,
        endDatetime,
      };
  
      // 스케줄 추가 API 호출
      addSchedule(scheduleData);
    };

  const handleEdit = (index: number, schedule: string) => {
    console.log(`수정: ${index}, ${schedule}`);
  };

  return (
    <div className="w-[400px] h-[540px] bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center text-2xl font-semibold text-[#5CA157] mb-4">
        <button onClick={handlePrevMonth} className="text-xl px-2 py-1 bg-[#F0F0F0] rounded">
          ◀
        </button>
        <span>📅 {currentYear}.{currentMonth + 1}</span>
        <button onClick={handleNextMonth} className="text-xl px-2 py-1 bg-[#F0F0F0] rounded">
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div key={index} className="w-[40px] h-[40px] flex justify-center items-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4" style={{ maxHeight: "240px", overflowY: "auto" }}>
        {renderDays()}
      </div>

      <div className="bg-[#F6F8F1] w-full h-[150px] flex flex-col pt-4 px-4 overflow-y-auto">
        <div className="text-xl font-semibold text-[#5CA157] mb-2">
          {selectedDate ? `${selectedDate}의 일정` : "📢 오늘의 일정"}
        </div>
        <div className="whitespace-pre-wrap text-sm text-[#5CA157]">
          {selectedDate ? scheduleData?.filter(schedule => schedule.date === selectedDate).map(schedule => schedule.name).join(", ") || "해당 날짜에는 일정이 없습니다." : reminderMessage}
        </div>
      </div>

      {/* {isModalOpen && selectedDate && (
        <ScheduleModal
          selectedDate={selectedDate}
          schedulesForModal={new Map()}
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
      )} */}
    </div>
  );
};

export default Calendar;
