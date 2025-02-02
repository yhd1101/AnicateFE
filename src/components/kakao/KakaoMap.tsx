import React, { useEffect, useRef, useState } from "react";
import { useFetchSearchHospital } from "@/services/useFetchSearchHospital";
import { useMapInfo } from "@/services/useMapInfo";
import { getKakaoMapId } from "@/services/getKakaoMapId";
import HospitalSearch from "../search/HospitalSearch";
import { useSearch } from "@/context/SearchContext";



const KakaoMap: React.FC<{ setUserLocation: (location: { lat: number; lng: number }) => void }> = ({ setUserLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]); // 마커 관리
  const [activeInfowindow, setActiveInfowindow] = useState<any>(null); // 현재 열려 있는 말풍선
  // const [gu, setGu] = useState("");
  // const [dong, setDong] = useState("");

  const { gu: contextGu, dong: contextDong } = useSearch(); // Context에서 gu, dong 가져오기
  const [gu, setGu] = useState(contextGu); // Context 값을 초기값으로 로컬 상태 관리
  const [dong, setDong] = useState(contextDong);

  const { data: search } = useFetchSearchHospital(gu, dong); // 로컬 상태 기반 검색 데이터 가져오기
  console.log("Context 검색값:", contextGu, contextDong);
  console.log("로컬 상태 검색값:", gu, dong);
  console.log("검색 결과:", search);

  



  const { data: mapInfo } = useMapInfo(
    map?.getCenter()?.getLat() || 37.5665,
    map?.getCenter()?.getLng() || 126.9780
  );

  // const { data: search } = useFetchSearchHospital(gu, dong); // 구와 동 기반 검색 데이터 가져오기
  console.log(search);


  

  // 지도 초기화
  useEffect(() => {
    console.log("Kakao Maps API 확인:", window.kakao);
    if (window.kakao && window.kakao.maps) {
      
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const center = new window.kakao.maps.LatLng(latitude, longitude);
            const options = { center, level: 3 };
            const createdMap = new window.kakao.maps.Map(mapContainer.current, options);
            setMap(createdMap);
            setUserLocation({ lat: latitude, lng: longitude });
            setIsMapLoaded(true);
          },
          () => {
            const fallbackCenter = new window.kakao.maps.LatLng(37.5665, 126.9780);
            const options = { center: fallbackCenter, level: 3 };
            const createdMap = new window.kakao.maps.Map(mapContainer.current, options);
            setMap(createdMap);
            setUserLocation({ lat: 37.5665, lng: 126.9780 });
            setIsMapLoaded(true);
          }
        );
      });
    }
  }, [setUserLocation]);

  // 모든 마커 제거 함수
  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]); // 상태 초기화
  };

  // 마커 추가 함수
  const addMarkers = (hospitals: any[]) => {
    clearMarkers(); // 기존 모든 마커 제거

    const newMarkers: any[] = [];

    hospitals.forEach(async (hospital) => {
      const position = new window.kakao.maps.LatLng(Number(hospital.latitude), Number(hospital.longitude));
      const id = await getKakaoMapId(hospital.longitude, hospital.latitude, hospital.bplcNm);

      const marker = new window.kakao.maps.Marker({ position, map });
      newMarkers.push(marker);

      const content = `
        <div style="padding:10px; width:200px; font-size:14px; background:white; border:1px solid #ccc; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);">
          <strong style="font-size:16px; font-weight:bold; color:black;">${hospital.bplcNm}</strong>
          <div style="margin-top:5px; color:gray;">${hospital.rdnWhlAddr}</div>
          <button id="detail-button-${id}" style="margin-top:8px; color:blue; background:none; border:none; cursor:pointer;">
            상세보기
          </button>
        </div>
      `;

      const infowindow = new window.kakao.maps.InfoWindow({
        content,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (activeInfowindow) activeInfowindow.close();
        infowindow.open(map, marker);
        setActiveInfowindow(infowindow);

        setTimeout(() => {
          const detailButton = document.getElementById(`detail-button-${id}`);
          if (detailButton) {
            detailButton.addEventListener("click", () => {
              window.open(`https://place.map.kakao.com/${id}`);
            });
          }
        }, 0);
      });

      window.kakao.maps.event.addListener(infowindow, "close", () => {
        setActiveInfowindow(null);
      });
    });

    setMarkers(newMarkers); // 새로운 마커 상태 업데이트
  };

  // 초기 마커 추가 (useMapInfo 데이터 기반)
  useEffect(() => {
    if (map && mapInfo?.data?.nearbyHospitals && gu === "" && dong === "") {
      addMarkers(mapInfo.data.nearbyHospitals);
    }
  }, [map, mapInfo]);

  // 검색 데이터로 마커 추가
  useEffect(() => {
    if (map && search?.data) {
      addMarkers(search.data); // 검색 결과만 표시

      if (search.data.length > 0) {
        const firstResult = search.data[0];
        const center = new window.kakao.maps.LatLng(Number(firstResult.latitude), Number(firstResult.longitude));
        map.setCenter(center);
      }
    }
  }, [map, search]);

  // 검색 핸들러
  const handleSearch = (inputGu: string, inputDong: string) => {
    setGu(inputGu.trim()); // 공백 제거 후 상태 업데이트
    setDong(inputDong.trim()); // 공백 제거 후 상태 업데이트
  };

  return (
    <div className="relative" style={{ width: "950px", height: "550px" }}>
      {isMapLoaded && <HospitalSearch onSearch={handleSearch} />}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default KakaoMap;
