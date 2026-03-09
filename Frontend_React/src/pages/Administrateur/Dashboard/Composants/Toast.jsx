import { Ic } from "./data/Icones";

const Toast = ({toast}) => {
  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-2.5
                  px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold
                  animate-[toastIn_.3s_ease]
                  ${
                    toast.type === "ok"
                      ? "bg-white border-green-200 text-green-700"
                      : "bg-white border-red-200   text-red-700"
                  }`}
      style={{ animation: "toastIn .3s ease" }}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${toast.type === "ok" ? "bg-green-100" : "bg-red-100"}`}
      >
        {toast.type === "ok" ? (
          <Ic.Check className="w-3.5 h-3.5" />
        ) : (
          <Ic.X className="w-3.5 h-3.5" />
        )}
      </div>
      {toast.msg}
    </div>
  );
};
export default Toast;
