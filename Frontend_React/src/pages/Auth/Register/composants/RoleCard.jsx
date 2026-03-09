import Icon from "./Icon";
import IC from "../Data/IC";

export default function RoleCard({ role, selected, onSelect }) {
  const isActive = selected === role.value;
  return (
    <button
      type="button"
      onClick={() => onSelect(role.value)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer border-none w-full transition-all duration-200 focus-visible:outline-2"
      style={{
        background: isActive
          ? "linear-gradient(135deg,#D4AF37,#f5d060)"
          : "#fafaf8",
        border: `1.5px solid ${isActive ? "#D4AF37" : "#f0ead6"}`,
        boxShadow: isActive ? "0 4px 16px rgba(212,175,55,0.3)" : "none",
        transform: isActive ? "translateY(-2px)" : "none",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background: isActive ? "rgba(23,23,23,0.15)" : "rgba(212,175,55,0.1)",
          color: isActive ? "#171717" : "#D4AF37",
        }}
      >
        <Icon d={role.icon} size={20} sw={1.8} />
      </div>
      <p
        className="text-sm font-bold leading-tight text-center"
        style={{
          fontFamily: "'Baloo 2', cursive",
          color: isActive ? "#171717" : "#404040",
        }}
      >
        {role.label}
      </p>
      <p
        className="text-xs text-center leading-snug"
        style={{
          fontFamily: "'Comic Neue', cursive",
          color: isActive ? "rgba(23,23,23,0.6)" : "#aaa",
        }}
      >
        {role.desc}
      </p>
      {isActive && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#171717" }}
        >
          <Icon d={IC.check} size={11} sw={2.5} className="text-[#D4AF37]" />
        </div>
      )}
    </button>
  );
}
