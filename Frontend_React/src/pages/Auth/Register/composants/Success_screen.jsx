import { useNavigate } from "react-router-dom";
import IC from "../Data/IC";
import ROLES from "../Data/ROLES";
import Icon from "./Icon";

const Success_screen = ({ form, setStep, setSubmitted, setForm }) => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-6"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#D4AF37,#f5d060)",
            boxShadow: "0 8px 28px rgba(212,175,55,0.4)",
          }}
        >
          <Icon d={IC.check} size={36} sw={2.5} className="text-[#171717]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#171717]">
          Compte créé avec succès !
        </h1>
        <p
          className="text-sm text-gray-400 leading-relaxed"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          Bienvenue,{" "}
          <strong className="text-[#171717]">
            {form.prenom} {form.nom}
          </strong>{" "}
          ! Votre compte{" "}
          <strong style={{ color: "#D4AF37" }}>
            {ROLES.find((r) => r.value === form.role)?.label}
          </strong>{" "}
          est en cours de validation. Un email vous sera envoyé sous 24h.
        </p>
        <button
          onClick={() => {
            navigate("/login");
            setStep(1);
            setSubmitted(false);
            setForm({
              prenom: "",
              nom: "",
              email: "",
              telephone: "",
              password: "",
              confirmPassword: "",
              role: "",
              matricule: "",
              promotion: "",
              acceptTerms: false,
            });
          }}
          className="px-6 py-3 rounded-xl text-white font-bold cursor-pointer border-none transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg,#D4AF37,#f5d060)",
            color: "#171717",
            boxShadow: "0 4px 18px rgba(212,175,55,0.35)",
            fontFamily: "'Baloo 2', cursive",
          }}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
};

export default Success_screen;
