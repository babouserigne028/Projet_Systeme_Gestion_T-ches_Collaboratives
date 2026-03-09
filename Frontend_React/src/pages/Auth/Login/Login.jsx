import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Illustration from "./composants/Illustration";
import Stat from "./composants/Stats";
import Testimonial from "./composants/Testimonial";
import "./Login.css";
import useLogin from "../../../services/hooks/auth/useLogin";

const STATS = [
  { value: 1200, suffix: "+", label: "Étudiants" },
  { value: 98, suffix: "%", label: "Satisfaction" },
  { value: 340, suffix: "+", label: "Projets" },
];

export default function Login() {
  const navigate = useNavigate();
  const { loading, error, login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStatsOn(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      {/* ══════════════ LEFT PANEL — Illustration ══════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 xl:w-3/5 relative overflow-hidden p-12"
        style={{
          background:
            "linear-gradient(145deg, #171717 0%, #2d2208 55%, #1a1500 100%)",
        }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #f5d060 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
            style={{
              background:
                "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            }}
          />
          {/* subtle grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top: logo + brand name */}
        <div className="relative z-10 fade-up flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#D4AF37,#f5d060)",
              boxShadow: "0 4px 14px rgba(212,175,55,.4)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
          </span>
        </div>

        {/* Center: headline + illustration */}
        <div className="relative z-10 flex flex-col items-center gap-8 fade-up-1">
          <div className="text-center">
            <h2
              className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Gérez vos projets
              <br />
              <span style={{ color: "#D4AF37" }}>avec clarté</span>
            </h2>
            <p
              className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Planifiez, assignez et suivez vos tâches en temps réel depuis une
              interface pensée pour l'environnement académique.
            </p>
          </div>
          <Illustration />
        </div>

        {/* Stats row */}
        <div className="relative z-10 fade-up-2">
          <div
            className="flex justify-around py-4 px-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {STATS.map((s) => (
              <Stat key={s.label} {...s} animate={statsOn} />
            ))}
          </div>
          {/* Testimonial */}
          <div className="mt-4">
            <Testimonial />
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL — Login form ══════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-10 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8 fade-up">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#D4AF37,#f5d060)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span
              className="text-[#171717] font-bold text-base"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8 fade-up">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#D4AF37", fontFamily: "'Comic Neue', cursive" }}
            >
              Bon retour 👋
            </p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Connectez-vous
              <br />à votre espace
            </h1>
            <p
              className="text-sm text-gray-400 mt-2"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Entrez vos identifiants pour continuer.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-3.5 rounded-xl border fade-up"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: "rgb(239,68,68)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p
                  className="text-sm font-medium"
                  style={{
                    color: "rgb(239,68,68)",
                    fontFamily: "'Comic Neue', cursive",
                  }}
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5 fade-up-1">
              <label
                className="text-sm font-semibold text-[#404040]"
                style={{ fontFamily: "'Baloo 2', cursive" }}
                htmlFor="email"
              >
                Adresse email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  className="esmt-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@esmt.sn"
                  autoComplete="email"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 fade-up-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-semibold text-[#404040]"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                  htmlFor="password"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-xs text-gray-400 hover:text-[#D4AF37] hover:underline transition-colors duration-150 cursor-pointer"
                  style={{ fontFamily: "'Comic Neue', cursive" }}
                >
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  className="esmt-input"
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.8rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center p-1 bg-transparent border-none cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-colors duration-150 focus-visible:outline-2 focus-visible:rounded"
                >
                  {showPwd ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer fade-up-3 select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#D4AF37]"
              />
              <span
                className="text-sm text-gray-400"
                style={{ fontFamily: "'Comic Neue', cursive" }}
              >
                Se souvenir de moi
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              className="fade-up-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: loading ? "#22c55e" : "#D4AF37",
                fontFamily: "'Baloo 2', cursive",
                boxShadow: loading
                  ? "0 6px 20px rgba(34,197,94,0.35)"
                  : "0 6px 20px rgba(212,175,55,0.4)",
                transition: "background .35s, box-shadow .35s, transform .15s",
              }}
              disabled={loading}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#fff"
                      strokeOpacity="0.2"
                    />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div
            className="text-center mt-6 fade-up-5"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            <p className="text-sm text-gray-400">
              Pas encore inscrit ?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-[#D4AF37] hover:text-[#f5d060] transition-colors duration-150 cursor-pointer border-none bg-transparent p-0"
              >
                Créer un compte
              </button>
            </p>
          </div>

          {/* Footer */}
          <p
            className="text-center text-xs text-gray-300 mt-8"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            © {new Date().getFullYear()} ESMT · Gestion de tâches collaboratives
          </p>
        </div>
      </div>
    </div>
  );
}
