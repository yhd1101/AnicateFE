import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { periodicModalState, scheduleModalState } from "@/recoil/atoms/loginState"; // Recoil 상태 임포트
import { useSingleScheduleQuery } from "@/services/useScheduleData";
import { usePetQuery } from "@/services/usePetQuery";
import axios from "axios";
import { PeriodicModal } from "./PeriodicModal";


export const BigCalendar: React.FC = () => {

  

  
  const { data, isLoading, error } = useSingleScheduleQuery();
  const userId = sessionStorage.getItem("id"); // userId는 sessionStorage에 저장되어 있어야 함
  

  const { data: petData, error: petError, isLoading: petIsLoading } = usePetQuery(Number(userId));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Map<string, string[]>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useRecoilState(scheduleModalState); // ScheduleModal 상태 관리

  const [schedulesForCalendar, setSchedulesForCalendar] = useState<Map<string, string[]>>(new Map());
  const [schedulesForModal, setSchedulesForModal] = useState<Map<string, string[]>>(new Map());
  const [, setPeriodicModalState] = useRecoilState(periodicModalState); // 로그인 모달 상태

  const handleLoginClick = () => {
    setPeriodicModalState({ isModalOpen: true }); // 로그인 모달 열기
  };




  const [editingSchedule, setEditingSchedule] = useState<{
    index: number;
    name: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  


  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
const [selectedPetName, setSelectedPetName] = useState<string | null>(null);

  console.log(data);
  console.log("petdatas", petData);

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

  // 시간을 두 자리로 보장하는 함수
const padToTwoDigits = (num: number) => (num < 10 ? `0${num}` : `${num}`);

// 스케줄 추가 버튼 클릭 핸들러
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
    // 정규식으로 시간과 이름 분리
    const match = schedule.match(/(\d{2}:\d{2}) ~ (\d{2}:\d{2}) (.+)/);
  
    if (!match) {
      console.error("스케줄 문자열 형식이 잘못되었습니다:", schedule);
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
  
  
  const handleSaveEdit = (index: number) => {
    if (!editingSchedule) return;
  
    const updatedSchedule = `${editingSchedule.startTime} ~ ${editingSchedule.endTime} ${editingSchedule.name}`;
  
    // 서버로 업데이트 요청 보내기 (필요한 경우)
    // await axios.put('/api/schedule', { ...editingSchedule });
  
    // 로컬 상태 업데이트
    setSchedulesForModal((prev) => {
      const updated = new Map(prev);
      const schedules = updated.get(selectedDate!) || [];
      schedules[index] = updatedSchedule;
      updated.set(selectedDate!, schedules);
      return updated;
    });
  
    setEditingSchedule(null); // 수정 상태 해제
  };
  

  

  
  


useEffect(() => {
  if (data) {
    const loadedSchedulesForModal = new Map();
    const loadedSchedulesForCalendar = new Map();

    data.forEach((item) => {
      // 날짜 추출
      const date = new Date(item.startDatetime).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\./g, "").trim().replace(/\s/g, "-"); // YYYY-MM-DD 형식

      // 시간 추출
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

      // 모달용 데이터: 시간 + 이름
      const modalScheduleText = `${startTime} ~ ${endTime} ${item.name}`;

      // 캘린더용 데이터: 이름만
      const calendarScheduleText = item.name;

      // 캘린더 스케줄 추가
      if (loadedSchedulesForCalendar.has(date)) {
        loadedSchedulesForCalendar.get(date).push(calendarScheduleText);
      } else {
        loadedSchedulesForCalendar.set(date, [calendarScheduleText]);
      }

      // 모달 스케줄 추가
      if (loadedSchedulesForModal.has(date)) {
        loadedSchedulesForModal.get(date).push(modalScheduleText);
      } else {
        loadedSchedulesForModal.set(date, [modalScheduleText]);
      }
    });

    setSchedulesForCalendar(loadedSchedulesForCalendar);
    setSchedulesForModal(loadedSchedulesForModal);
  }
}, [data]);


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

  const closeScheduleList = () => {
    setSelectedDate(null); // 스케줄 리스트 모달 닫기
  };

  const openScheduleModal = () => {
    setIsModalOpen({ isModalOpen: true }); // 객체로 상태 업데이트
    closeScheduleList(); // 스케줄 리스트 모달 닫기
  };

  const deleteSchedule = (schedule: string) => {
    if (selectedDate) {
      setSchedules((prevSchedules) => {
        const updatedSchedules = new Map(prevSchedules);
        const currentSchedules = updatedSchedules.get(selectedDate)?.filter(item => item !== schedule) || [];
        updatedSchedules.set(selectedDate, currentSchedules);
        return updatedSchedules;
      });
    }
  };

  const renderCalendar = () => {
    const weeks = generateCalendar();
  
    return weeks.map((week, index) => (
      <div key={index} className="flex">
        {week.map((day, dayIndex) => {
          const dayNumber = parseInt(day, 10);
          const isNextMonth = day && dayNumber < 7 && index === weeks.length - 1; // 다음 달
          const isPreviousMonth = day && index === 0 && dayNumber > 20; // 이전 달
          const isCurrentMonth = !isPreviousMonth && !isNextMonth; // 현재 달인지 확인
  
          // 현재 달일 경우에만 데이터 매칭
          const formattedDate = isCurrentMonth
            ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${day.padStart(2, '0')}`
            : null;
  
          return (
            <div
              key={dayIndex}
              className={`w-32 h-32 border border-gray-300 flex  items-center relative p-4 ${
                isNextMonth ? "bg-blue-200 text-gray-500" : isPreviousMonth ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => isCurrentMonth && formattedDate && openScheduleList(formattedDate)}
            >
             <div className="relative w-full h-full flex flex-col items-start">
  <span className="text-sm font-semibold">{day}</span>
  {isCurrentMonth && formattedDate && schedulesForCalendar.has(formattedDate) ? (
  <ul className="text-xs mt-1 space-y-1">
    {/* 일정 하나만 표시 */}
    {schedulesForCalendar.get(formattedDate)!.slice(0, 2).map((schedule, idx) => (
      <li
        key={idx}
        style={{ color: "#5CA157" }}
      >
        {schedule.length > 6 ? `${schedule.slice(0, 6)}...` : schedule}
      </li>
    ))}
    {/* 일정이 2개 이상일 때 더보기 표시 */}
    {schedulesForCalendar.get(formattedDate)!.length > 2 && (
      <li
        className="text-blue-500 cursor-pointer"
        onClick={() => openScheduleList(formattedDate)}
      >
        더보기...
      </li>
    )}
  </ul>
) : (
  <span className="text-xs mt-1">일정 없음</span>
)}

</div>

            </div>
          );
        })}
      </div>
    ));
  };
  

  return (
    <div className="p-6">
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="px-4 py-2 bg-[#5CA157] text-white rounded-md">
              &#8592; 이전 달
            </button>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-[#5CA157] text-white rounded-md">
              다음 달 &#8594;
            </button>
          </div>

          <span className="font-bold text-xl">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</span>

          <button  onClick={handleLoginClick} className="px-4 py-2 bg-[#5CA157] text-white rounded-md">
            정기 일정
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          <div className="text-center text-lg">일</div>
          <div className="text-center text-lg">월</div>
          <div className="text-center text-lg">화</div>
          <div className="text-center text-lg">수</div>
          <div className="text-center text-lg">목</div>
          <div className="text-center text-lg">금</div>
          <div className="text-center text-lg">토</div>
        </div>
        <div className="mt-4" style={{ height: "auto" }}>
          {renderCalendar()}
        </div>
      </div>

      <PeriodicModal/>

      {/* Schedule List */}
      {selectedDate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={closeScheduleList}>
          <div className="bg-white p-6 rounded-md w-1/3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">{selectedDate} 일정</h3>
            <div className="mb-4">
            <ul>
              {schedulesForModal.get(selectedDate)?.map((schedule, index) => (
                <li key={index} className="flex justify-between items-start gap-4 w-full">
                  {/* 수정 상태 확인 */}
                  {editingSchedule && editingSchedule.index === index ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveEdit(index);
                      }}
                      className="space-y-2 w-full"
                    >
                      <input
                        type="text"
                        value={editingSchedule.name} // 수정된 스케줄 이름 표시
                        onChange={(e) =>
                          setEditingSchedule((prev) => ({
                            ...prev!,
                            name: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                      <div className="flex gap-2">
                        <select
                          value={editingSchedule.startTime.split(":")[0]}
                          onChange={(e) =>
                            setEditingSchedule((prev) => ({
                              ...prev!,
                              startTime: `${e.target.value}:${editingSchedule.startTime.split(":")[1]}`,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editingSchedule.startTime.split(":")[1]}
                          onChange={(e) =>
                            setEditingSchedule((prev) => ({
                              ...prev!,
                              startTime: `${editingSchedule.startTime.split(":")[0]}:${e.target.value}`,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        <span>~</span>

                        <select
                          value={editingSchedule.endTime.split(":")[0]}
                          onChange={(e) =>
                            setEditingSchedule((prev) => ({
                              ...prev!,
                              endTime: `${e.target.value}:${editingSchedule.endTime.split(":")[1]}`,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editingSchedule.endTime.split(":")[1]}
                          onChange={(e) =>
                            setEditingSchedule((prev) => ({
                              ...prev!,
                              endTime: `${editingSchedule.endTime.split(":")[0]}:${e.target.value}`,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {String(i).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule)}
                          className="text-red-500 px-2 py-1 rounded hover:bg-transparent"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between w-full">
                      <span
                        style={{
                          whiteSpace: "normal", // 텍스트가 길면 줄바꿈
                          wordBreak: "break-word", // 단어가 길 경우 줄바꿈
                          maxWidth: "70%", // 버튼 영역과 충돌하지 않도록 너비 제한
                          overflowWrap: "break-word", // 길이가 길 경우 자동 줄바꿈
                        }}
                      >
                        {schedule}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteSchedule(schedule)}
                          className="text-red-500 px-2 py-1 rounded hover:bg-transparent"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => handleEdit(index, schedule)}
                          className="text-blue-500 px-2 py-1 rounded hover:bg-transparent"
                        >
                          수정
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>


            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="스케줄 이름"
                className="bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700"
              />
              <div className="flex gap-1 items-center">
                {/* 시작 시간 선택 */}
                <select className="appearance-none start-hour bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
                  {Array.from({ length: 24 }, (_, i) => (
                    <option value={i}>{i < 10 ? `0${i}` : i}</option>
                  ))}
                </select>
                <span>:</span>
                {/* 시작 분 선택 */}
                <select className="appearance-none start-minute bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
                  {Array.from({ length: 60 }, (_, i) => (
                    <option value={i}>{i < 10 ? `0${i}` : i}</option>
                  ))}
                </select>
                <span>부터</span>
                {/* 종료 시간 선택 */}
                <select className="appearance-none end-hour bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
                  {Array.from({ length: 24 }, (_, i) => (
                    <option value={i}>{i < 10 ? `0${i}` : i}</option>
                  ))}
                </select>
                <span>:</span>
                {/* 종료 분 선택 */}
                <select className="appearance-none end-minute bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
                  {Array.from({ length: 60 }, (_, i) => (
                    <option value={i}>{i < 10 ? `0${i}` : i}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-green-500 text-green-700 rounded-md w-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-700"
                  defaultValue="" // 기본값 설정
                  onChange={(e) => {
                    const selectedPet = petData?.data.find((pet) => pet.name === e.target.value);
                    setSelectedPetId(selectedPet?.id || null);
                    setSelectedPetName(selectedPet?.name || null);
                    console.log(`Selected pet: ID = ${selectedPet?.id}, Name = ${selectedPet?.name}`);
                  }}
                >
                  <option value="" disabled>
                    펫 선택
                  </option>
                  {petData && petData.data && petData.data.length > 0 ? (
                    petData.data.map((pet) => (
                      <option key={pet.id} value={pet.name}>
                        {pet.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>펫 데이터가 없습니다</option>
                  )}
                </select>
              </div>


              <button onClick={handleAddSchedule} className="px-4 py-2 bg-[#5CA157] text-white rounded-md">
                스케줄 추가
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default BigCalendar;
  