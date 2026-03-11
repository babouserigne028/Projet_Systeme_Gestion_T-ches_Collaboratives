import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Register.css";
import Icon from "./composants/Icon";
import Stepper from "./composants/Stepper";
import LeftPanel from "./composants/LeftPanel";
import IC from "./Data/IC";
import ROLES from "./Data/ROLES";
import Step1 from "./composants/Step1";
import Step2 from "./composants/Step2";
import Step3 from "./composants/Step3";
import useRegister from "../../../services/hooks/auth/useRegister";
import Success_screen from "./composants/Success_screen";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    role: "",
    promotion: "",
    photo: null,
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  /* ── Validation per step ── */
  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.prenom.trim()) e.prenom = "Le prénom est requis.";
      if (!form.nom.trim()) e.nom = "Le nom est requis.";
      if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
      if (!/^[0-9]{9,}$/.test(form.telephone.replace(/\s/g, "")))
        e.telephone = "Numéro invalide (9 chiffres min).";
      if (emailAvailable === false) e.email = "Cet email est déjà utilisé.";
      if (emailAvailable === null && /\S+@\S+\.\S+/.test(form.email))
        e.email = "Veuillez vérifier la disponibilité de l'email.";
    }
    if (s === 2) {
      if (form.password.length < 8) e.password = "8 caractères minimum.";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (s === 3) {
      if (!form.role) e.role = "Veuillez choisir un rôle.";
      if (!form.promotion.trim()) e.promotion = "La promotion est requise.";
      if (!form.acceptTerms)
        e.acceptTerms = "Vous devez accepter les conditions.";
    }
    return e;
  };

  const nextStep = () => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(3);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("nom", form.nom);
    formData.append("prenom", form.prenom);
    formData.append("telephone", form.telephone);
    formData.append("role", form.role);
    formData.append("promotion", form.promotion);
    if (form.photo) formData.append("photo", form.photo);
    const res = await register(formData);
    if (res) setSubmitted(true);
  };

  /* ── Input class helper ── */
  const inputClass = (k) => `esmt-input${errors[k] ? " esmt-input-error" : ""}`;

  /* ── Success screen ── */
  if (submitted) {
    return (
      <Success_screen
        form={form}
        setStep={setStep}
        setSubmitted={setSubmitted}
        setForm={setForm}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      {/* ── Left panel ── */}
      <LeftPanel step={step} />

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-5 py-10 sm:px-10 overflow-y-auto">
        <div className="w-full max-w-md fade-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#D4AF37,#f5d060)" }}
            >
              <Icon
                d={IC.tasks}
                size={18}
                sw={2.2}
                className="text-[#171717]"
              />
            </div>
            <span
              className="text-[#171717] font-bold text-base"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#D4AF37", fontFamily: "'Comic Neue', cursive" }}
            >
              Nouveau compte
            </p>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-tight"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Créez votre espace
              <br />
              ESMT Task Manager
            </h1>
          </div>

          {/* Stepper */}
          <Stepper current={step} />

          {/* Step content */}
          <form
            onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
            className="flex flex-col gap-6"
          >
            <div key={step} className="slide-in">
              {step === 1 && (
                <Step1
                  form={form}
                  set={set}
                  errors={errors}
                  setEmailAvailable={setEmailAvailable}
                />
              )}
              {step === 2 && (
                <Step2
                  form={form}
                  set={set}
                  errors={errors}
                  showPwd={showPwd}
                  setShowPwd={setShowPwd}
                  showCpwd={showCpwd}
                  setShowCpwd={setShowCpwd}
                  inputClass={inputClass}
                />
              )}
              {step === 3 && (
                <Step3
                  ROLES={ROLES}
                  form={form}
                  set={set}
                  setForm={setForm}
                  errors={errors}
                  inputClass={inputClass}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-1">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer border-none transition-all duration-200 hover:bg-gray-100 focus-visible:outline-2"
                  style={{
                    background: "#f9f6ee",
                    border: "1.5px solid #f0ead6",
                    color: "#888",
                    fontFamily: "'Baloo 2', cursive",
                  }}
                >
                  <Icon d={IC.arrowL} size={15} sw={2.2} />
                  Retour
                </button>
              )}
              <button
                type={step === 3 ? "submit" : "button"}
                onClick={step < 3 ? nextStep : undefined}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base cursor-pointer border-none transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 text-[#171717]"
                style={{
                  background: "linear-gradient(135deg,#D4AF37,#f5d060)",
                  boxShadow: "0 4px 18px rgba(212,175,55,0.38)",
                  fontFamily: "'Baloo 2', cursive",
                  transition: "transform .15s, box-shadow .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(212,175,55,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 18px rgba(212,175,55,0.38)";
                }}
              >
                {step === 3 ? (
                  <>
                    <Icon d={IC.check} size={16} sw={2.5} />
                    Créer mon compte
                  </>
                ) : (
                  <>
                    Continuer
                    <Icon d={IC.arrow} size={15} sw={2.2} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p
            className="text-center text-sm text-gray-400 mt-6"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Déjà un compte ?{" "}
            <a
              onClick={() => navigate("/login")}
              className="font-bold hover:underline transition-colors"
              style={{ color: "#D4AF37", cursor: "pointer" }}
            >
              Se connecter
            </a>
          </p>

          {/* Footer */}
          <p
            className="text-center text-xs text-gray-300 mt-4 pt-4 border-t border-gray-100"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            © {new Date().getFullYear()} ESMT · Gestion de tâches collaboratives
          </p>
        </div>
      </div>
    </div>
  );
}
