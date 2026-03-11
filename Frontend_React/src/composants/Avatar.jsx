import { API_URL } from "../config/api";

const Avatar = ({ ini, role, sm, photo }) => {
  const getColors = (role) => {
    switch (role) {
      case "administrateur":
        return "bg-red-50 border-red-200 text-red-700";
      case "professeur":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "etudiant":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const size = sm ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  const colors = getColors(role);

  const photoUrl = photo
    ? photo.startsWith("http")
      ? photo
      : `${API_URL}${photo}`
    : null;

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={ini}
        className={`${size} rounded-full flex-shrink-0 object-cover border-2 ${colors.split(" ").find((c) => c.startsWith("border-")) || "border-gray-200"}`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full flex-shrink-0 flex items-center justify-center font-bold border-2 ${colors}`}
    >
      {ini}
    </div>
  );
};

export default Avatar;
