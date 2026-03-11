import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  return { toast, showToast, setToast };
};
