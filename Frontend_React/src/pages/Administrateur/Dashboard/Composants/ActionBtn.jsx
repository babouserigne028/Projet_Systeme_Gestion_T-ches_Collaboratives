const ActionBtn = ({ label, color, Icon, onClick }) => {
  const styles = {
    green: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
    red: "bg-red-50   border-red-200   text-red-700   hover:bg-red-100",
  }[color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
};

export default ActionBtn;
