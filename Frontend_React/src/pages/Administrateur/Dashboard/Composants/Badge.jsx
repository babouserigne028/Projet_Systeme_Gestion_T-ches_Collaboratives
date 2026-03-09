const Badge = ({ children, color = "gray" }) => {
  const map = {
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    green: "bg-green-50  border-green-200  text-green-700",
    blue: "bg-blue-50   border-blue-200   text-blue-700",
    red: "bg-red-50    border-red-200    text-red-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    gray: "bg-gray-100  border-gray-200   text-gray-500",
  }[color];
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${map}`}
    >
      {children}
    </span>
  );
};

export default Badge;
