import { useEffect } from "react";

// esc키를 눌렀을 때 모달 닫기 함수
export function useCloseOnEsc(handleClose) {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();  // 모달 닫기 함수 호출
      }
    };

    // 키 이벤트 리스너 추가
    window.addEventListener("keydown", handleEscKey);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [handleClose]);
}
