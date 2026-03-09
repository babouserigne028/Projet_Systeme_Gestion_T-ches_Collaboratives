const Avatar = ({ ini, role, sm }) => {
  const isProf = role === "professeur";
  const size = sm ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${size} rounded-full flex-shrink-0 flex items-center justify-center font-bold border-2
      ${isProf ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-green-50 border-green-200 text-green-700"}`}
    >
      {ini}
    </div>
  );
};

export default Avatar;
