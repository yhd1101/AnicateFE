interface CalendarProps {
  reminderMessage: string; // 일정에 대한 알림 메시지
  scheduleDates: string[]; // 스케줄 날짜 배열 (YYYY-MM-DD 형식)
}

const Calendar: React.FC<CalendarProps> = ({ reminderMessage, scheduleDates = [] }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 ~ 11
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-[40px] h-[40px]"></div>);
    }

    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isScheduled = scheduleDates.includes(dateString);
      const isToday = i === currentDay;

      let dayClass = "w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer";

      if (isToday) {
        dayClass += " bg-[#5CA157] text-white";
      } else if (isScheduled) {
        dayClass += " bg-[#FFA500] text-white";
      }

      days.push(
        <div key={i} className={dayClass}>
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-[400px] h-[550px] bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-center items-center text-2xl font-semibold text-[#5CA157] mb-4">
        <span>📅 {currentYear}.{currentMonth + 1}</span>
      </div>
      <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div key={index} className="w-[40px] h-[40px] flex justify-center items-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">{renderDays()}</div>
      <div className="bg-[#F6F8F1] w-full h-[30%] flex flex-col pt-6 pl-6">
        <div className="text-xl font-semibold text-[#5CA157] mb-2">
          <span>📢 오늘의 일정</span>
        </div>
        <div className="whitespace-pre-wrap text-sm text-[#5CA157]">{reminderMessage}</div>
      </div>
    </div>
  );
};

export default Calendar;
