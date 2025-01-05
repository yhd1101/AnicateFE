declare module '@/*';

export interface LoginState {
    isLogin: boolean | DefaultValue | null;
  }
  
  export interface LoginModalState {
    isModalOpen: boolean;
  }

// src/types/type.ts
export interface PageMeta {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CommunityResponseDTO {
  id: number;
  userId: number;
  title: string;
  content: string;
  picture: string;
  animalSpecies: string;
  commentCount: number;
  likeCount: number;
  canEdit: boolean;
}

export interface PageDTO<T> {
  data: T[];
  meta: PageMeta;
}


export interface debounce {
  (map: kakao.maps.Map, locate: location, setLocate: SetterOrUpdater<location>): void;
}

export type customoverlay = kakao.maps.CustomOverlay | null;

export type MapScript = (lat: number, lng: number, draggable: boolean) => void;

export type MiniMapScript = (lat: number, lng: number) => void;

export type KakaoMapId = (longitude: number, latitude: number, placeName: string) => void;