import React, { useState } from "react";

interface CalendarProps {
  reminderMessage: string; // 일정에 대한 알림 메시지
  scheduleDates: string[]; // 스케줄 날짜 배열 (YYYY-MM-DD 형식)
  scheduleData?: { date: string; name: string }[]; // 스케줄 데이터 배열 (선택적)
}

const Calendar: React.FC<CalendarProps> = ({ reminderMessage, scheduleDates = [], scheduleData = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0 ~ 11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(""); // 선택된 날짜

  const currentDay = today.getDate();
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
    setSelectedDate(""); // 월 변경 시 선택 초기화
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(""); // 월 변경 시 선택 초기화
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
        dayClass += " bg-[#007BFF] text-white"; // 선택된 날짜 강조
      } else if (isToday) {
        dayClass += " bg-[#5CA157] text-white";
      } else if (isScheduled) {
        dayClass += " bg-[#FFA500] text-white";
      }

      days.push(
        <div
          key={i}
          className={dayClass}
          onClick={() => setSelectedDate(dateString)} // 날짜 클릭 시 상태 업데이트
        >
          {i}
        </div>
      );
    }

    return days;
  };

  // 오늘 날짜와 선택된 날짜의 일정 메시지
  const displayMessage = selectedDate === todayFormatted || selectedDate === ""
    ? scheduleData
        ?.filter(schedule => schedule.date === todayFormatted)
        .map(schedule => schedule.name)
        .join(", ") || "오늘은 일정이 없습니다."
    : scheduleData
        ?.filter(schedule => schedule.date === selectedDate)
        .map(schedule => schedule.name)
        .join(", ") || "해당 날짜에는 일정이 없습니다.";

  // 제목
  const messageTitle = selectedDate === todayFormatted || selectedDate === ""
    ? "📢 오늘의 일정"
    : `${selectedDate}의 일정`;

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
      <div
        className="grid grid-cols-7 gap-2 mb-4"
        style={{ maxHeight: "240px", overflowY: "auto" }}
      >
        {renderDays()}
      </div>
      {/* 일정 메시지 */}
      <div className="bg-[#F6F8F1] w-full h-[150px] flex flex-col pt-4 px-4 overflow-y-auto">
        <div className="text-xl font-semibold text-[#5CA157] mb-2">{messageTitle}</div>
        <div className="whitespace-pre-wrap text-sm text-[#5CA157]">{displayMessage}</div>
      </div>
    </div>
  );
};

export default Calendar;
