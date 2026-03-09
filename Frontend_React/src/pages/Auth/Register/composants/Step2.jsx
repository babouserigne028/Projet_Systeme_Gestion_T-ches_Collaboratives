import IC from "../Data/IC";
import Field from "./Field";
import Icon from "./Icon";
import PasswordStrength from "./PasswordStrength";

const Step2 = ({
  form,
  set,
  errors,
  showPwd,
  setShowPwd,
  showCpwd,
  setShowCpwd,
  inputClass,
}) => (
  <div className="flex flex-col gap-4">
    <Field label="Mot de passe" icon={IC.lock} error={errors.password}>
      <input
        className={inputClass("password")}
        type={showPwd ? "text" : "password"}
        placeholder="••••••••"
        value={form.password}
        onChange={set("password")}
        style={{ paddingLeft: "2.4rem", paddingRight: "2.8rem" }}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShowPwd(!showPwd)}
        className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-1 cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-colors duration-150 focus-visible:outline-2 focus-visible:rounded"
      >
        <Icon d={showPwd ? IC.eyeOff : IC.eye} size={16} />
      </button>
    </Field>

    {form.password && <PasswordStrength pwd={form.password} />}

    <Field
      label="Confirmer le mot de passe"
      icon={IC.lock}
      error={errors.confirmPassword}
    >
      <input
        className={inputClass("confirmPassword")}
        type={showCpwd ? "text" : "password"}
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        style={{ paddingLeft: "2.4rem", paddingRight: "2.8rem" }}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShowCpwd(!showCpwd)}
        className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-1 cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-colors duration-150 focus-visible:outline-2 focus-visible:rounded"
      >
        <Icon d={showCpwd ? IC.eyeOff : IC.eye} size={16} />
      </button>
    </Field>

    {/* Password tips */}
    <div
      className="rounded-xl p-3.5"
      style={{ background: "#fffbee", border: "1px solid #f0ead6" }}
    >
      <p
        className="text-xs font-semibold mb-2"
        style={{ color: "#a07d1a", fontFamily: "'Baloo 2', cursive" }}
      >
        Conseils pour un mot de passe fort :
      </p>
      {[
        [/.{8,}/, "Au moins 8 caractères"],
        [/[A-Z]/, "Une lettre majuscule"],
        [/[0-9]/, "Un chiffre"],
        [/[^a-zA-Z0-9]/, "Un caractère spécial (!@#...)"],
      ].map(([rx, txt]) => (
        <div key={txt} className="flex items-center gap-2 mt-1">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: rx.test(form.password) ? "#22c55e" : "#e5e7eb",
            }}
          >
            <Icon
              d={IC.check}
              size={9}
              sw={2.5}
              className={
                rx.test(form.password) ? "text-white" : "text-gray-400"
              }
            />
          </div>
          <span
            className="text-xs"
            style={{
              fontFamily: "'Comic Neue', cursive",
              color: rx.test(form.password) ? "#166534" : "#9ca3af",
            }}
          >
            {txt}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Step2;
