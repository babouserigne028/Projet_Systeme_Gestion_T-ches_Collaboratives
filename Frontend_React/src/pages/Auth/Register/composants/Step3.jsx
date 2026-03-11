import { useRef } from "react";
import IC from "../Data/IC";
import Field from "./Field";
import RoleCard from "./RoleCard";

const Step3 = ({ ROLES, form, set, setForm, errors, inputClass }) => {
  const fileInputRef = useRef(null);

  return (
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

        {/* Photo de profil */}
        <div>
          <p
            className="text-sm font-semibold text-[#404040] mb-2"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Photo de profil
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm((f) => ({ ...f, photo: file }));
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all cursor-pointer"
            style={{
              borderColor: form.photo ? "#D4AF37" : "#e5e7eb",
              background: form.photo ? "#fffbee" : "#fafafa",
              color: form.photo ? "#a07d1a" : "#9ca3af",
              fontFamily: "'Comic Neue', cursive",
            }}
          >
            {form.photo ? (
              <>
                <img
                  src={URL.createObjectURL(form.photo)}
                  alt="preview"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="truncate">{form.photo.name}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Choisir une photo</span>
              </>
            )}
          </button>
          <p
            className="text-[10px] text-gray-400 mt-1"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Optionnel · JPG, PNG
          </p>
        </div>
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
};
export default Step3;
