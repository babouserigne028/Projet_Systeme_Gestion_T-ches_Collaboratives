import useCountUp from "../../../../services/hooks/auth/useCountUp";

export default function Stat({ value, suffix, label, animate }) {
  const n = useCountUp(value, 1400, animate);
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-2xl font-extrabold leading-none text-white"
        style={{
          fontFamily: "'Baloo 2', cursive",
          textShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        {n}
        {suffix}
      </span>
      <span
        className="text-xs text-white/60 mt-0.5 tracking-wider uppercase"
        style={{ fontFamily: "'Comic Neue', cursive" }}
      >
        {label}
      </span>
    </div>
  );
}
