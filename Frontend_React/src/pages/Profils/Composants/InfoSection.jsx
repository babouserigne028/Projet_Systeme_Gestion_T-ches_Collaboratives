import { Ic } from "../../../composants/Icons";
import { getFullName } from "./helpers";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
    <div className="p-2.5 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
      <Icon className="w-4 h-4 text-yellow-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-medium mt-0.5 break-words">
        {value}
      </p>
    </div>
  </div>
);

const InfoSection = ({ user }) => (
  <div className="grid grid-cols-1 gap-6">
    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
          <Ic.User className="w-5 h-5 text-yellow-600" />
        </div>
        Informations personnelles
      </h3>
      <div className="space-y-2">
        <InfoRow
          icon={Ic.User}
          label="Nom complet"
          value={getFullName(user.prenom, user.nom)}
        />
        <InfoRow icon={Ic.Mail} label="Email" value={user.email} />
        <InfoRow
          icon={Ic.Phone}
          label="Téléphone"
          value={user.telephone || "—"}
        />
        {user.matricule && (
          <InfoRow icon={Ic.User} label="Matricule" value={user.matricule} />
        )}
        {user.promotion && (
          <InfoRow
            icon={Ic.Calendar}
            label="Promotion"
            value={user.promotion}
          />
        )}
      </div>
    </div>
  </div>
);

export default InfoSection;
