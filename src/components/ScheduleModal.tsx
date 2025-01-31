import React, { useEffect } from "react";
interface ScheduleModalProps {
  selectedDate: string | null;
  schedulesForModal: Map<string, string[]>;
  editingSchedule: {
    index: number;
    name: string;
    startTime: string;
    endTime: string;
  } | null;
  setEditingSchedule: React.Dispatch<
    React.SetStateAction<{
      index: number;
      name: string;
      startTime: string;
      endTime: string;
    } | null>
  >;
  handleSaveEdit: (index: number) => void;
  handleEdit: (index: number, schedule: string) => void; // 'handleEdit' 추가
  deleteSchedule: (index: number) => void;
  handleAddSchedule: () => void;
  closeScheduleList: () => void;
  petData?: any;
  setSelectedPetId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedPetName: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  selectedDate,
  schedulesForModal,
  editingSchedule,
  setEditingSchedule,
  handleSaveEdit,
  deleteSchedule,
  handleAddSchedule,
  closeScheduleList,
  petData,
  setSelectedPetId,
  setSelectedPetName,
}) => {

  useEffect(() => {
    console.log("Current Editing Schedule:", editingSchedule);
  }, [editingSchedule]);

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
  
  return (
   <div
  className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
  onClick={closeScheduleList}
>
  <div
    className="bg-white p-6 rounded-md w-[400px] h-[400px] overflow-auto"
    onClick={(e) => e.stopPropagation()}
  >

        <h3 className="text-xl font-semibold mb-4">{selectedDate} 일정</h3>
        <div className="mb-4 max-h-[95px] overflow-y-auto">
          <ul>
            {schedulesForModal.get(selectedDate || "")?.map((schedule, index) => (
              <li key={index} className="flex justify-between items-start gap-2">
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
                         onClick={() => setEditingSchedule(null)} // editingSchedule 초기화
                        className="text-red-500 px-2 py-1 rounded hover:bg-transparent"
                      >
                        취소
                      </button>

                      </div>
                    </form>
                  ) : (
                  <div className="flex justify-between w-full">
                    <span>{schedule}</span>
                    <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index, schedule)}
                      className="text-blue-500 px-2 py-1 rounded hover:bg-transparent"
                    >
                      수정
                    </button>

                      <button
                        onClick={() => deleteSchedule(index)}
                        className="text-red-500 px-4 py-2 rounded-md"
                      >
                        삭제
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
            {/* 시작 시간 */}
            <select className="appearance-none start-hour bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i < 10 ? `0${i}` : i}
                </option>
              ))}
            </select>
            <span>:</span>
            <select className="appearance-none start-minute bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i < 10 ? `0${i}` : i}
                </option>
              ))}
            </select>
            <span>~</span>
            {/* 종료 시간 */}
            <select className="appearance-none end-hour bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i < 10 ? `0${i}` : i}
                </option>
              ))}
            </select>
            <span>:</span>
            <select className="appearance-none end-minute bg-transparent border-none border-b-2 border-green-500 focus:outline-none focus:border-green-700 text-center">
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i < 10 ? `0${i}` : i}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-green-500 text-green-700 rounded-md w-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-700"
              defaultValue=""
              onChange={(e) => {
                const selectedPet = petData?.data.find((pet) => pet.name === e.target.value);
                setSelectedPetId(selectedPet?.id || null);
                setSelectedPetName(selectedPet?.name || null);
              }}
            >
              <option value="" disabled>
                펫 선택
              </option>
              {petData?.data?.length > 0 ? (
                petData.data.map((pet: any) => (
                  <option key={pet.id} value={pet.name}>
                    {pet.name}
                  </option>
                ))
              ) : (
                <option disabled>펫 데이터가 없습니다</option>
              )}
            </select>
          </div>
          <button onClick={handleAddSchedule} className="bg-[#5CA157] text-white px-4 py-2 rounded-md">
            스케줄 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
