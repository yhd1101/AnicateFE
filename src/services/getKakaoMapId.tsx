import { KakaoMapId } from "@/types/type";
import axios from "axios";

export const getKakaoMapId: KakaoMapId = async (longitude, latitude, placeName) => {
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?y=${longitude}&x=${latitude}&radius=20000&query=${placeName}`,
      {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
        },
      }
    );
    const id = response.data?.documents[0]?.id || "";
    return id;
  } catch (error) {
    console.error("Kakao API 요청 실패: ", error);
    return null;
  }
};
