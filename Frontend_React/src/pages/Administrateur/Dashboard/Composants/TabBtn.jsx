const TabBtn = ({ id, label, cur, set, badge }) => {
  const active = cur === id;
  return (
    <button
      onClick={() => set(id)}
      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer
        ${active ? "bg-yellow-400 text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
    >
      {label}
      {badge > 0 && (
        <span className="bg-red-500 text-white rounded-full px-1.5 py-px text-[10px] font-bold leading-none">
          {badge}
        </span>
      )}
    </button>
  );
};

export default TabBtn;
