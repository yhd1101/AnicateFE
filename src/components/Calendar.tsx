// src/components/Calendar.tsx

import React, { useState } from 'react';

interface CalendarProps {
  reminderMessage: string; // 일정에 대한 알림 메시지
}

const Calendar: React.FC<CalendarProps> = ({ reminderMessage }) => {
  // 현재 날짜 정보를 가져오기
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 ~ 11 (0: 1월, 11: 12월)
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  // 해당 월의 첫 번째 날이 무슨 요일인지 계산
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  
  // 해당 월의 마지막 날 계산
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [selectedDates, setSelectedDates] = useState<Set<number>>(new Set()); // 선택된 날짜들을 저장하는 상태

  const handleDateClick = (day: number) => {
    const updatedSelectedDates = new Set(selectedDates);
    if (updatedSelectedDates.has(day)) {
      updatedSelectedDates.delete(day); // 이미 선택된 날짜는 선택 취소
    } else {
      updatedSelectedDates.add(day); // 선택되지 않은 날짜는 추가
    }
    setSelectedDates(updatedSelectedDates);
  };

  const renderDays = () => {
    const days = [];
    
    // 첫 번째 날까지 공백을 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-[40px] h-[40px]"></div>);
    }

    // 해당 월의 날짜를 렌더링
    for (let i = 1; i <= lastDayOfMonth; i++) {
      days.push(
        <div
          key={i}
          className={`w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer hover:bg-[#5CA157] ${
            i === currentDay ? 'bg-[#5CA157]' : ''
          } ${selectedDates.has(i) ? 'bg-[#4A8B42]' : ''}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-[400px] h-[600px] bg-white shadow-md rounded-lg p-4 mb-6">
      {/* 현재 날짜와 월 */}
      <div className="flex justify-center items-center text-2xl font-semibold text-[#5CA157] mb-4">
        <span>📅 {currentYear}.{currentMonth + 1}</span>
      </div>
      <div className="flex justify-center items-center mb-4">
        <span className="text-lg">현재 날짜: {currentDay}</span>
      </div>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div key={index} className="w-[40px] h-[40px] flex justify-center items-center">
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {renderDays()}
      </div>

      {/* 오늘의 일정 */}
      <div className="bg-[#F6F8F1] w-full h-[30%] flex flex-col pt-6 pl-6">
        <div className="text-xl font-semibold text-[#5CA157] mb-2">
          <span>📢 오늘의 일정</span>
        </div>
        <div className="whitespace-pre-wrap text-sm text-[#5CA157]">
          {reminderMessage}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
