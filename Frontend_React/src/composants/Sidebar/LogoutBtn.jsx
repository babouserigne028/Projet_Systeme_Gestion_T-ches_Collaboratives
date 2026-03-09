import { ICONS } from "./data/icons";

/* ─── Logout Button Component ─────────────────────────────────── */
function LogoutBtn({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 w-full rounded-xl cursor-pointer border-none transition-all duration-200"
      style={{
        padding: open ? "0.65rem 1rem" : "0.65rem",
        justifyContent: open ? "flex-start" : "center",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "rgba(239,68,68,0.7)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.85)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.border = "1px solid transparent";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        e.currentTarget.style.color = "rgba(239,68,68,0.7)";
        e.currentTarget.style.border = "1px solid rgba(239,68,68,0.2)";
      }}
      aria-label="Se déconnecter"
    >
      <span className="shrink-0 transition-transform duration-200 group-hover:rotate-12">
        <ICONS.logout size={18} />
      </span>
      {open && (
        <span
          className="text-sm font-bold"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          Déconnexion
        </span>
      )}
    </button>
  );
}

export default LogoutBtn;
