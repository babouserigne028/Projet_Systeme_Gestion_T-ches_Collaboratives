/* ─── Section Label Component ─────────────────────────────────── */
function SectionLabel({ label, isOpen }) {
  if (!isOpen)
    return (
      <div
        className="mx-3 my-3 h-px"
        style={{ background: "rgba(212,175,55,0.2)" }}
      />
    );

  return (
    <li className="px-3 pt-5 pb-2">
      <span
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        style={{
          color: "rgba(212,175,55,0.6)",
          fontFamily: "'Comic Neue', cursive",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-60" />
        {label}
      </span>
    </li>
  );
}

export default SectionLabel;
