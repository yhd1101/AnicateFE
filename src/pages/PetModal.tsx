import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { petModalState } from "@/recoil/atoms/loginState"; // Recoil 상태 임포트
import axios from "axios";

export const PetModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(petModalState); // 상태 사용
  const [image, setImage] = useState<string | null>('/image 8.png'); // 기본 이미지를 설정
  const [selectedSpecies, setSelectedSpecies] = useState<string>(''); // 선택된 종
  const [selectedBreed, setSelectedBreed] = useState<string>(''); // 선택된 품종
  const [selectedGender, setSelectedGender] = useState<string>(''); // 선택된 성별
  const [selectedName, setSelectedName] = useState<string>(''); // 반려동물 이름
  const [selectedAge, setSelectedAge] = useState<string>(''); // 반려동물 나이
  const [speciesList, setSpeciesList] = useState<any[]>([]); // 종 목록 상태
  const [breedList, setBreedList] = useState<any[]>([]); // 품종 목록 상태

  // 종 목록 가져오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/species")
      .then((response) => {
        console.log("Species Data:", response.data); // 데이터 확인
        setSpeciesList(response.data.data); // 종 데이터 상태 업데이트
      })
      .catch((error) => {
        console.error("Error fetching species data:", error);
      });
  }, []);

  // 품종 목록 가져오기 (선택된 종에 따라 품종 목록을 가져옴)
  useEffect(() => {
    if (selectedSpecies) {
      axios.get(`http://localhost:8080/api/breeds/${selectedSpecies}`)
        .then((response) => {
          console.log("Breed Data:", response.data); // 데이터 확인
          setBreedList(response.data.data); // 품종 데이터 상태 업데이트
        })
        .catch((error) => {
          console.error("Error fetching breed data:", error);
        });
    }
  }, [selectedSpecies]);

  // // 이미지 파일 선택 후 업데이트하는 함수
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result as string); // 선택한 이미지의 URL을 상태로 저장
  //     };
  //     console.log(file);
  //     reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
  //   }
  // };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file); // `File` 객체를 상태로 저장
      console.log("Selected File:", file); // 선택한 파일 로그 확인
    }
  };
  // 클릭 시 파일 선택
  const handleImageClick = () => {
    document.getElementById("fileInput")?.click();
  };

  // 품종 선택 변경
  const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpecies(event.target.value);
    setSelectedBreed(''); // 품종을 초기화
  };

  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedName(event.target.value);
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAge(event.target.value);
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem('token'); // 세션에서 토큰 가져오기
    if (!token) {
      console.error("No token found");
      return;
    }
    const tokenWithoutQuotes = token.replace(/^"|"$/g, ""); // 앞뒤 따옴표 제거
  
    const formData = new FormData();
    const dto = {
      speciesId: selectedSpecies,
      breedId: selectedBreed,
      name: selectedName,
      age: selectedAge,
      gender: selectedGender,
    };
  
    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  
    // `File` 객체를 FormData에 추가
    if (image instanceof File) {
      formData.append("file", image); // 파일 추가
    } else {
      console.error("Image is not a valid file");
    }
  
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // FormData에 추가된 항목 확인
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/pet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${tokenWithoutQuotes}`,
        },
      });
      console.log("Response:", response.data); // 성공적인 응답 확인
      setIsModalOpen({ isModalOpen: false });
    } catch (error) {
      console.error("Error submitting pet data:", error);
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isModalOpen.isModalOpen}
      onRequestClose={() => setIsModalOpen({ isModalOpen: false })}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
          backgroundColor: '#F6F8F1',
          width: '40%',
          height: '97%',
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px',
        },
      }}
    >
      <div className="flex flex-col items-center">
        <div className="w-[350px] max-h-[90%] flex flex-col items-center">
          {/* 이미지 클릭 시 파일 선택 */}
          <div
            className="bg-white mx-auto flex justify-center items-center mb-6"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%', // 둥글게 만들기 위해 border-radius 설정
              overflow: 'hidden', // 이미지가 div 밖으로 넘치지 않도록 설정
            }}
            onClick={handleImageClick}
          >
            <img
              // src={image || '/image 8.png'} // 이미지가 있으면 그 이미지를 사용하고, 없으면 기본 이미지를 사용
              src={image instanceof File ? URL.createObjectURL(image) : '/image 8.png'}
              alt="Pet"
              className="object-cover"
              style={{
                width: '100%', // 너비를 div의 100%로 설정
                height: '100%', // 높이를 div의 100%로 설정
              }}
            />
          </div>

          {/* 파일 선택 input (보이지 않게 숨기고 클릭 시 열기) */}
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          {/* 반려동물 정보 등록 폼 */}
          <div className="w-full flex flex-col">
            <label className="block text-[#5CA157] font-semibold mb-2">반려동물 이름</label>
            <input
              type="text"
              value={selectedName}
              onChange={handleNameChange}
              className="w-[90%] p-2 mb-4 border rounded-md"
            />

            <label className="block text-[#5CA157] font-semibold mb-2">나이</label>
            <input
              type="text"
              value={selectedAge}
              onChange={handleAgeChange}
              className="w-[90%] p-2 mb-4 border rounded-md"
            />

            {/* 종 드롭다운 */}
            <label className="block text-[#5CA157] font-semibold mb-2">종</label>
            <select
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              className="w-[90%] p-2 mb-4 border rounded-md"
            >
              <option value="">종 선택</option>
              {speciesList.map((species) => (
                <option key={species.id} value={species.id}>{species.name}</option>
              ))}
            </select>

            {/* 품종 드롭다운 */}
            {selectedSpecies && (
              <>
                <label className="block text-[#5CA157] font-semibold mb-2">품종</label>
                <select
                  value={selectedBreed}
                  onChange={handleBreedChange}
                  className="w-[90%] p-2 mb-4 border rounded-md"
                >
                  <option value="">품종 선택</option>
                  {breedList.map((breed) => (
                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                  ))}
                </select>
              </>
            )}

            {/* 성별 드롭다운 */}
            <label className="block text-[#5CA157] font-semibold mb-2">성별</label>
            <select
              value={selectedGender}
              onChange={handleGenderChange}
              className="w-[90%] p-2 mb-4 border rounded-md"
            >
              <option value="">성별 선택</option>
              <option value="수컷">수컷</option>
              <option value="암컷">암컷</option>
            </select>

            {/* 등록 버튼 */}
            <button
              onClick={handleSubmit}
              className="bg-[#5CA157] text-white font-semibold py-2 px-6 rounded-md mt-4 hover:bg-[#4A8B42]"
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
