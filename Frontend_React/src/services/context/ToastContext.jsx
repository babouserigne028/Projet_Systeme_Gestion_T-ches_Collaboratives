import { createContext, useContext, useState } from "react";
import Toast from "../../composants/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast toast={toast} />}
    </ToastContext.Provider>
  );
};

export const useToastGlobal = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastGlobal doit être utilisé dans ToastProvider");
  }
  return context;
};
