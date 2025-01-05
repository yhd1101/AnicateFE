// InfoWindowContent.tsx
import React from "react";

interface InfoWindowContentProps {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  onClickMap: (longitude: number, latitude: number, name: string) => void;
}

const InfoWindowContent: React.FC<InfoWindowContentProps> = ({
  name,
  address,
  longitude,
  latitude,
  onClickMap,
}) => {
  return (
    <div
      style={{
        padding: "10px",
        width: "200px",
        fontSize: "14px",
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      }}
    >
      <strong style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
        {name}
      </strong>
      <div style={{ marginTop: "5px", color: "gray" }}>{address}</div>
      <button
        style={{
          marginTop: "8px",
          color: "blue",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        onClick={(event) => {
          event.stopPropagation(); // 클릭 이벤트 전파를 막습니다.
          onClickMap(longitude, latitude, name); // onClickMap을 호출
        }}
      >
        상세보기
      </button>
    </div>
  );
};

export default InfoWindowContent;
