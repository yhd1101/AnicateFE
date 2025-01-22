import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

interface PetData {
    id: number;
    name: string;
    age: string;
    speciesId: string;
    speciesName: string;
    breedId: string;
    breedName: string;
    gender: string;
    picture: string;
  }
  


interface PetUpdateModalProps {
    petData: PetData; // petData 타입 지정
    isOpen: boolean;
    onClose: () => void;
  }
  

export const PetUpdateModal: React.FC<PetUpdateModalProps> = ({ petData, isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(petData?.picture || '/image 8.png');
  const [selectedSpecies, setSelectedSpecies] = useState<string>(petData?.speciesId || '');
  const [selectedBreed, setSelectedBreed] = useState<string>(petData?.breedId || '');
  const [selectedGender, setSelectedGender] = useState<string>(petData?.gender || '');
  const [selectedName, setSelectedName] = useState<string>(petData?.name || '');
  const [selectedAge, setSelectedAge] = useState<string>(petData?.age || '');
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [breedList, setBreedList] = useState<any[]>([]);

  // 종 목록 가져오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/species")
      .then((response) => {
        setSpeciesList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching species data:", error);
      });
  }, []);

  // 품종 목록 가져오기
  useEffect(() => {
    if (selectedSpecies) {
      axios.get(`http://localhost:8080/api/breeds/${selectedSpecies}`)
        .then((response) => {
          setBreedList(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching breed data:", error);
        });
    }
  }, [selectedSpecies]);

  const handleSubmit = async () => {
    // 수정 요청 로직 작성
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
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
        <input
          type="text"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          placeholder="반려동물 이름"
        />
        <input
          type="text"
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
          placeholder="반려동물 나이"
        />
        {/* 종 드롭다운 */}
        <select
          value={selectedSpecies}
          onChange={(e) => setSelectedSpecies(e.target.value)}
        >
          <option value="">종 선택</option>
          {speciesList.map((species) => (
            <option key={species.id} value={species.id}>{species.name}</option>
          ))}
        </select>
        {/* 품종 드롭다운 */}
        {selectedSpecies && (
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="">품종 선택</option>
            {breedList.map((breed) => (
              <option key={breed.id} value={breed.id}>{breed.name}</option>
            ))}
          </select>
        )}
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="">성별 선택</option>
          <option value="수컷">수컷</option>
          <option value="암컷">암컷</option>
        </select>
        <button onClick={handleSubmit}>수정하기</button>
      </div>
    </Modal>
  );
};
