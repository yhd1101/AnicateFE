import React, { useState } from "react";
import Modal from "react-modal";
import { useUpdatePetMutation } from "@/services/useUpdatePetMutation";
import { useGetPetDetails } from "@/pages/useGetPetDetails";
import { useQueryClient } from "@tanstack/react-query";

interface PetData {
  id: number | null; // id가 null일 가능성 대비
  name: string;
  age: string;
  picture: string;
  speciesId: number;
  breedId: number;
  gender: string;
}

interface PetUpdateModalProps {
  petData: PetData;
  isOpen: boolean;
  onClose: () => void;
}

export const PetUpdateModal: React.FC<PetUpdateModalProps> = ({ petData, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const userId = Number(sessionStorage.getItem("id"));
  const { mutate: updatePet } = useUpdatePetMutation(userId);
  const { data: petDatas } = useGetPetDetails(petData?.id ?? 0);

  // 기존 데이터 기본값으로 설정
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(petData?.picture || "/image 8.png");
  const [selectedName, setSelectedName] = useState<string>(petData?.name || "");
  const [selectedAge, setSelectedAge] = useState<string>(petData?.age || "");
  const [speciesId] = useState<number>((petDatas?.data.speciesId));
const [breedId] = useState<number>(petDatas?.data.breedId);

  const [gender] = useState<string>(petData?.gender || ""); // 기존 값 유지

  console.log(speciesId,"dsad"),
  console.log(breedId, "dsdbrd");

  // 이미지 변경 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 클릭 시 파일 선택창 열기
  const handleImageClick = () => {
    document.getElementById("fileInput")?.click();
  };
  const handleSubmit = () => {
    if (!petData.id) {
      alert("잘못된 요청입니다. 다시 시도해 주세요.");
      return;
    }
  
    // 기존 데이터 유지 + 변경된 값만 추가
    const updatedData: any = {
      petId: petData.id,
      speciesId: petDatas?.data.speciesId ?? petData.speciesId, // 기존 데이터 유지
      breedId: petDatas?.data.breedId ?? petData.breedId, // 기존 데이터 유지
      gender: petDatas?.data.gender ?? petData.gender, // 기존 데이터 유지
      name: selectedName, // 변경 가능
      age: selectedAge, // 변경 가능
    };
  
    // ✅ 변경된 값만 추가
    if (image) updatedData.file = image; // 이미지 변경 시 추가
  
    console.log("보낼 데이터 확인:", updatedData);
    queryClient.invalidateQueries(["petDetails"]);
    updatePet(updatedData);
  };
  
  

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          backgroundColor: "#F6F8F1",
          width: "400px",
          height: "700px",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <div className="flex flex-col items-center">
        {/* 이미지 선택 */}
        <div
          className="bg-white mx-auto flex justify-center items-center mb-6"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
          onClick={handleImageClick}
        >
          <img
            src={imagePreview}
            alt="Pet"
            className="object-cover"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <input
          type="file"
          id="fileInput"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* 반려동물 정보 입력 */}
        <div className="w-full flex flex-col">
          <label className="block text-[#5CA157] font-semibold mb-2">반려동물 이름</label>
          <input
            type="text"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="w-[90%] p-2 mb-4 border rounded-md"
          />

          <label className="block text-[#5CA157] font-semibold mb-2">나이</label>
          <input
            type="text"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-[90%] p-2 mb-4 border rounded-md"
          />

          <button
            onClick={handleSubmit}
            className="bg-[#5CA157] text-white font-semibold py-2 px-6 rounded-md mt-4 hover:bg-[#4A8B42]"
          >
            수정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};
