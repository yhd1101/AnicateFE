import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAddInformationMutation } from "@/services/useAddInformationMutation";

const InformationPost: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: addInformation } = useAddInformationMutation();

  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [breedList, setBreedList] = useState<any[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>(""); // ✅ ID 저장
  const [selectedSpeciesName, setSelectedSpeciesName] = useState<string>(""); // ✅ 이름 저장
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [guide, setGuide] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // ✅ 종 목록 가져오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/species")
      .then((response) => setSpeciesList(response.data.data))
      .catch((error) => console.error("Error fetching species data:", error));
  }, []);

  // ✅ 선택한 종의 ID를 기반으로 품종 목록 가져오기
  useEffect(() => {
    if (selectedSpecies) {
      axios.get(`http://localhost:8080/api/breeds/${selectedSpecies}`)
        .then((response) => setBreedList(response.data.data))
        .catch((error) => console.error("Error fetching breed data:", error));
    } else {
      setBreedList([]);
      setSelectedBreed(""); // 종이 변경되면 품종 초기화
    }
  }, [selectedSpecies]);

  // ✅ 종 선택 핸들러
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = speciesList.find((s) => s.id.toString() === selectedId);

    setSelectedSpecies(selectedId); // ✅ ID 저장
    setSelectedSpeciesName(selected?.name || ""); // ✅ 이름 저장
  };

  // ✅ 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // ✅ 정보 등록 API 호출
  const handleSubmit = () => {
    if (!selectedSpeciesName || !selectedBreed || !age || !weight || !height || !guide || !description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const requestData = {
      speciesName: selectedSpeciesName, // ✅ 이름을 API에 전송
      breedName: selectedBreed,
      age,
      weight,
      height,
      guide,
      description,
      file,
    };

    addInformation(requestData, {
      onSuccess: () => {
        alert("정보가 성공적으로 등록되었습니다.");
        navigate("/information");
      },
      onError: (error) => {
        console.error("등록 실패:", error);
        alert("등록 실패: " + (error.message || "알 수 없는 오류"));
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5CA157] text-center mt-6 mb-5">
        반려 동물 정보 등록
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-none">
        
        {/* ✅ 종 선택 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">종 선택</label>
          <select value={selectedSpecies} onChange={handleSpeciesChange} className="w-full p-3 rounded-md bg-[#F6F8F1]">
            <option value="">종을 선택하세요</option>
            {speciesList.map((species) => (
              <option key={species.id} value={species.id}>
                {species.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ 품종 선택 */}
        <div>
          <label className="text-[#D8E6BE] font-bold">품종 선택</label>
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)} className="w-full p-3 rounded-md bg-[#F6F8F1]" disabled={!selectedSpecies}>
            <option value="">품종을 선택하세요</option>
            {breedList.map((breed) => (
              <option key={breed.id} value={breed.name}>{breed.name}</option>
            ))}
          </select>
        </div>

        {/* ✅ 입력 필드 */}
        <div><label className="text-[#D8E6BE] font-bold">수명</label><input type="text" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-2 bg-[#F6F8F1]" /></div>
        <div><label className="text-[#D8E6BE] font-bold">무게</label><input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 bg-[#F6F8F1]" /></div>
        <div><label className="text-[#D8E6BE] font-bold">높이</label><input type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-2 bg-[#F6F8F1]" /></div>
        <div><label className="text-[#D8E6BE] font-bold">양육 가이드</label><textarea value={guide} onChange={(e) => setGuide(e.target.value)} className="w-full p-2 bg-[#F6F8F1]" rows={3} /></div>
        <div><label className="text-[#D8E6BE] font-bold">특징</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 bg-[#F6F8F1]" rows={3} /></div>

        {/* ✅ 파일 첨부 */}
        <div><label className="text-[#D8E6BE] font-bold">파일 첨부</label><input type="file" onChange={handleFileChange} className="mt-2" /></div>

        {/* ✅ 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={() => navigate("/information")} className="p-2 bg-gray-300 text-gray-700 rounded-md">취소</button>
          <button onClick={handleSubmit} className="p-2 bg-[#5CA157] text-white rounded-md hover:bg-[#4A8B42]">등록</button>
        </div>
      </div>
    </div>
  );
};

export default InformationPost;
