export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "?";
  return `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}`;
};
