import { Ic } from "../../../../composants/Icons";
import KpiCard from "./KpiCard";

const Overview = ({ response }) => {
  return (
    <div className="space-y-5">
      {/* KPI grid — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Utilisateurs totaux"
          value={response?.total}
          delta="+12 ce mois"
          Icon={Ic.Users}
          sparkKey="users"
          accent="#3B82F6"
          iconBg="#EFF6FF"
          delay={0}
        />
        <KpiCard
          label="Comptes en attente"
          value={response?.Non_validé}
          delta="À valider"
          positive={false}
          Icon={Ic.Clock}
          sparkKey="pending"
          accent="#EAB308"
          iconBg="#FFFBEB"
          delay={80}
        />
        <KpiCard
          label="Professeurs actifs"
          value={response?.par_role?.professeurs}
          delta="+3 ce mois"
          Icon={Ic.Cap}
          sparkKey="teachers"
          accent="#8B5CF6"
          iconBg="#F5F3FF"
          delay={160}
        />
        <KpiCard
          label="Étudiants actifs"
          value={response?.par_role?.etudiants}
          delta="+9 ce mois"
          Icon={Ic.Book}
          sparkKey="students"
          accent="#16A34A"
          iconBg="#F0FDF4"
          delay={240}
        />
      </div>
    </div>
  );
};

export default Overview;
