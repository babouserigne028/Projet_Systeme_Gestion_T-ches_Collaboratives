import { useEffect, useState } from "react";
import Stars from "./Stars";

/* ─── Testimonials data ──────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    avatar: "https://i.pravatar.cc/48?img=11",
    name: "Aminata Diallo",
    role: "Chef de projet · Promo 2024",
    text: "ESMT Task Manager a transformé notre façon de collaborer. Indispensable !",
    stars: 5,
  },
  {
    avatar: "https://i.pravatar.cc/48?img=32",
    name: "Moussa Ndiaye",
    role: "Étudiant Master · Promo 2025",
    text: "Suivi des tâches impeccable. On gagne un temps précieux au quotidien.",
    stars: 5,
  },
  {
    avatar: "https://i.pravatar.cc/48?img=47",
    name: "Fatou Sow",
    role: "Responsable pédagogique",
    text: "Nos équipes sont enfin synchronisées. Un outil pensé pour l'académique.",
    stars: 5,
  },
];

export default function Testimonial() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);
  const t = TESTIMONIALS[idx];
  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-500"
      style={{
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Big quote */}
      <span className="absolute -top-1 right-4 text-5xl font-serif text-white/10 select-none leading-none">
        "
      </span>
      <div className="flex items-center gap-3 mb-3">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
          style={{ border: "2px solid rgba(212,175,55,0.7)" }}
        />
        <div className="min-w-0">
          <p
            className="text-sm font-bold text-white truncate"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            {t.name}
          </p>
          <p
            className="text-xs text-white/50 truncate"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            {t.role}
          </p>
        </div>
        <div className="ml-auto">
          <Stars n={t.stars} />
        </div>
      </div>
      <p
        className="text-sm text-white/80 leading-relaxed"
        style={{ fontFamily: "'Comic Neue', cursive" }}
      >
        {t.text}
      </p>
      {/* dots */}
      <div className="flex gap-1.5 mt-4 justify-center">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Témoignage ${i + 1}`}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{
              width: i === idx ? "20px" : "6px",
              padding: 0,
              background: i === idx ? "#D4AF37" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
