import Icon from "./Icon";

export default function Field({ label, icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-semibold text-[#404040]"
        style={{ fontFamily: "'Baloo 2', cursive" }}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
            <Icon d={icon} size={15} />
          </span>
        )}
        {children}
      </div>
      {error && (
        <span
          className="text-xs text-red-400 flex items-center gap-1"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          <Icon
            d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            size={12}
          />
          {error}
        </span>
      )}
    </div>
  );
}
