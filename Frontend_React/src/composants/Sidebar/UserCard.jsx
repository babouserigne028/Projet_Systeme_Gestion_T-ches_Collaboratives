/* ─── User Card Component ─────────────────────────────────────── */

function UserCard({ user, isOpen }) {
  const roleName = user?.role;
  
  return (
    <div
      className={`flex items-center rounded-xl p-2.5 transition-all duration-300 ${isOpen ? "gap-3" : "justify-center"}`}
      style={{
        background: "rgba(212,175,55,0.08)",
        border: "1px solid rgba(212,175,55,0.2)",
      }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user?.prenom || "User"}
            className="w-9 h-9 rounded-full object-cover"
            style={{ border: "2px solid rgba(212,175,55,0.6)" }}
          />
        ) : (
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ 
              background: "linear-gradient(135deg, #D4AF37, #f5d060)",
              border: "2px solid rgba(212,175,55,0.6)" 
            }}
          >
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </div>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
      </div>

      {isOpen && (
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold text-white truncate leading-tight"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            {user?.prenom} {user?.nom}
          </p>
          <span
            className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
            style={{
              background: "rgba(212,175,55,0.18)",
              color: "#D4AF37",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            {roleName}
          </span>
        </div>
      )}
    </div>
  );
}

export default UserCard;
