import STEPS from "../Data/STEPS";
import IC from "../Data/IC";
import Icon from "./Icon";

export default function Stepper({ current }) {
  return (
    <div className="flex items-center justify-between mb-8 w-full">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: done
                    ? "#22c55e"
                    : active
                      ? "linear-gradient(135deg,#D4AF37,#f5d060)"
                      : "transparent",
                  border: done || active ? "none" : "2px solid #e5d9b6",
                  boxShadow: active
                    ? "0 4px 14px rgba(212,175,55,0.4)"
                    : "none",
                  color: done || active ? "#fff" : "#bbb",
                }}
              >
                {done ? (
                  <Icon d={IC.check} size={16} sw={2.5} />
                ) : (
                  <Icon d={s.icon} size={16} sw={active ? 2 : 1.6} />
                )}
              </div>
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{
                  fontFamily: "'Comic Neue', cursive",
                  color: done ? "#22c55e" : active ? "#D4AF37" : "#bbb",
                }}
              >
                {s.label}
              </span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                style={{ background: current > s.id ? "#22c55e" : "#f0ead6" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
