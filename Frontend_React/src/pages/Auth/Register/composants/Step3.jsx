import IC from "../Data/IC";
import Field from "./Field";
import RoleCard from "./RoleCard";

const Step3 = ({ ROLES, form, set, setForm, errors, inputClass }) => (
  <div className="flex flex-col gap-4">
    {/* Role cards */}
    <div>
      <p
        className="text-sm font-semibold text-[#404040] mb-2"
        style={{ fontFamily: "'Baloo 2', cursive" }}
      >
        Votre rôle
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map((r) => (
          <RoleCard
            key={r.value}
            role={r}
            selected={form.role}
            onSelect={(v) => setForm((f) => ({ ...f, role: v }))}
          />
        ))}
      </div>
      {errors.role && (
        <p
          className="text-xs text-red-400 mt-1.5"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          {errors.role}
        </p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <Field label="Matricule" icon={IC.id} error={errors.matricule}>
        <input
          className={inputClass("matricule")}
          type="text"
          placeholder="ESM-2024-001"
          value={form.matricule}
          onChange={set("matricule")}
          style={{ paddingLeft: "2.4rem" }}
        />
      </Field>
      <Field label="Promotion" icon={IC.cap} error={errors.promotion}>
        <input
          className={inputClass("promotion")}
          type="text"
          placeholder="2024–2025"
          value={form.promotion}
          onChange={set("promotion")}
          style={{ paddingLeft: "2.4rem" }}
        />
      </Field>
    </div>

    {/* Terms */}
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id="terms"
        checked={form.acceptTerms}
        onChange={set("acceptTerms")}
        className="w-5 h-5 rounded cursor-pointer accent-[#D4AF37] mt-0.5"
      />
      <label htmlFor="terms" className="cursor-pointer">
        <span
          className="text-sm leading-snug text-gray-500"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          J'accepte les{" "}
          <a
            href="#"
            className="underline font-semibold hover:text-[#D4AF37] transition-colors"
            style={{ color: "#D4AF37" }}
          >
            conditions d'utilisation
          </a>{" "}
          et la{" "}
          <a
            href="#"
            className="underline font-semibold hover:text-[#D4AF37] transition-colors"
            style={{ color: "#D4AF37" }}
          >
            politique de confidentialité
          </a>{" "}
          d'ESMT Task Manager.
        </span>
      </label>
    </div>
    {errors.acceptTerms && (
      <p
        className="text-xs text-red-400 -mt-2"
        style={{ fontFamily: "'Comic Neue', cursive" }}
      >
        {errors.acceptTerms}
      </p>
    )}
  </div>
);
export default Step3;
