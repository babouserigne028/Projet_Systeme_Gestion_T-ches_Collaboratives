import features from "../Data/features";
import IC from "../Data/IC";
import Icon from "./Icon";
export default function LeftPanel({ step }) {


  return (
    <div
      className="hidden lg:flex flex-col justify-between w-2/5 xl:w-1/2 relative overflow-hidden p-10 xl:p-12"
      style={{
        background:
          "linear-gradient(145deg,#171717 0%,#1f1800 60%,#0f0d00 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle,#D4AF37 0%,transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle,#f5d060 0%,transparent 70%)",
          }}
        />
        {/* grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern
              id="g"
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
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      {/* Top logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#D4AF37,#f5d060)",
            boxShadow: "0 4px 14px rgba(212,175,55,.4)",
          }}
        >
          <Icon d={IC.tasks} size={20} sw={2.2} className="text-[#171717]" />
        </div>
        <div>
          <p
            className="text-white font-bold text-base leading-tight"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
          </p>
          <p
            className="text-xs"
            style={{
              color: "rgba(212,175,55,0.5)",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            Espace collaboratif académique
          </p>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h2
            className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Rejoignez la
            <br />
            <span style={{ color: "#D4AF37" }}>communauté ESMT</span>
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            Créez votre compte en quelques étapes et accédez à votre espace de
            gestion de projets collaboratifs.
          </p>
        </div>

        {/* Feature list */}
        <ul className="flex flex-col gap-3">
          {features.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <Icon
                  d={f.icon}
                  size={15}
                  sw={1.8}
                  className="text-[#D4AF37]"
                />
              </div>
              <span
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Comic Neue', cursive",
                }}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Step progress visual */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212,175,55,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              color: "rgba(212,175,55,0.6)",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            Progression — Étape {step} sur 3
          </p>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background:
                    s <= step
                      ? "linear-gradient(90deg,#D4AF37,#f5d060)"
                      : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
          <p
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            {step === 1 && "Renseignez vos informations personnelles."}
            {step === 2 && "Choisissez un mot de passe sécurisé."}
            {step === 3 && "Sélectionnez votre rôle et finalisez."}
          </p>
        </div>
      </div>

      {/* Bottom stats */}
      <div
        className="relative z-10 flex justify-around py-4 px-4 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {[
          ["1 200+", "Étudiants"],
          ["98%", "Satisfaction"],
          ["340+", "Projets"],
        ].map(([v, l]) => (
          <div key={l} className="flex flex-col items-center">
            <span
              className="text-xl font-extrabold leading-none"
              style={{ color: "#D4AF37", fontFamily: "'Baloo 2', cursive" }}
            >
              {v}
            </span>
            <span
              className="text-xs mt-0.5"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Comic Neue', cursive",
              }}
            >
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
