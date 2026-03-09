const sparkPath = (data, w = 80, h = 28) => {
  const max = Math.max(...data),
    min = Math.min(...data);
  return (
    "M " +
    data
      .map(
        (v, i) =>
          `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`,
      )
      .join(" L ")
  );
};

export default sparkPath;