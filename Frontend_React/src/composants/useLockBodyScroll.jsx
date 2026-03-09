import { useEffect } from "react";

const useLockBodyScroll = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};

export default useLockBodyScroll;
