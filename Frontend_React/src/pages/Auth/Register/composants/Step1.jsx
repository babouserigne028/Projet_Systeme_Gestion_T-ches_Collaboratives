import { useEffect, useState } from "react";
import IC from "../Data/IC";
import Field from "./Field";
import inputClass from "./inputClass";
import useCheckEmail from "../../../../services/hooks/auth/useCheckEmail";

const Step1 = ({ form, set, errors, setEmailAvailable }) => {
  const { checkEmail, loading, error, isAvailable } = useCheckEmail();
  const [emailChecked, setEmailChecked] = useState(false);

  useEffect(() => {
    if (form.email && /\S+@\S+\.\S+/.test(form.email)) {
      checkEmail(form.email);
      setEmailChecked(true);
    } else {
      setEmailChecked(false);
      setEmailAvailable(null);
    }
  }, [form.email, checkEmail, setEmailAvailable]);

  useEffect(() => {
    if (emailChecked && isAvailable !== null) {
      setEmailAvailable(isAvailable);
    }
  }, [isAvailable, emailChecked, setEmailAvailable]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" icon={IC.user} error={errors.prenom}>
          <input
            className={inputClass("prenom")}
            type="text"
            placeholder="Aminata"
            value={form.prenom}
            onChange={set("prenom")}
            style={{ paddingLeft: "2.4rem" }}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Nom" icon={IC.user} error={errors.nom}>
          <input
            className={inputClass("nom")}
            type="text"
            placeholder="Diallo"
            value={form.nom}
            onChange={set("nom")}
            style={{ paddingLeft: "2.4rem" }}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field label="Adresse email" icon={IC.mail} error={errors.email}>
        <input
          className={inputClass("email")}
          type="email"
          placeholder="prenom.nom@esmt.sn"
          value={form.email}
          onChange={set("email")}
          style={{ paddingLeft: "2.4rem" }}
          autoComplete="email"
        />
        {emailChecked && (
          <div className="mt-2 text-sm font-semibold flex items-center gap-2">
            {loading && (
              <span style={{ color: "#D4AF37" }}>⏳ Vérification...</span>
            )}
            {!loading && isAvailable && (
              <span style={{ color: "#10b981" }}>✓ Email disponible</span>
            )}
            {!loading && isAvailable === false && (
              <span style={{ color: "#ef4444" }}>✗ Email déjà utilisé</span>
            )}
          </div>
        )}
      </Field>

      <Field label="Téléphone" icon={IC.phone} error={errors.telephone}>
        <input
          className={inputClass("telephone")}
          type="tel"
          placeholder="77 000 00 00"
          value={form.telephone}
          onChange={set("telephone")}
          style={{ paddingLeft: "2.4rem" }}
          autoComplete="tel"
        />
      </Field>
    </div>
  );
};

export default Step1;
