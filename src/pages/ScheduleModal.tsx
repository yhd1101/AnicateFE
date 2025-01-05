import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import {  scheduleModalState } from "@/recoil/atoms/loginState"; // Recoil 상태 임포트
import axios from "axios";

export const ScheduleModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(scheduleModalState); // 상태 사용


  
    
  

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
          height: '80%',
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px',
        },
      }}
    >
    dddd
    </Modal>
  );
};
