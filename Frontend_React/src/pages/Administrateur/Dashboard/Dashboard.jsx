import { useState } from "react";
import CreateUserModal from "./Composants/CreateUserModal";
import Header from "./Composants/Header";
import TabsHeader from "./Composants/TabsHeader";
import Overview from "./Composants/overview";
import Validation from "./Composants/Validation";
import TeacherStat from "./Composants/TeacherStat";
import useFetchStatUsers from "../../../services/hooks/utilisateur/useFetchStatUsers";
import useFetchListeUserEnAttentDeValidation from "../../../services/hooks/utilisateur/useFetchListeUserEnAttentDeValidation";
import useApproveUserEnAttente from "../../../services/hooks/utilisateur/useApproveUserEnAttente";
import useFetchStatsEligibleProf from "../../../services/hooks/utilisateur/useFetchStatsEligibleProf";
import { useToastGlobal } from "../../../services/context/ToastContext";

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const { showToast } = useToastGlobal();
  const [createUserModal, setCreateUserModal] = useState(false);

  const { response, refresh, loading, error } = useFetchStatUsers();
  const {
    response: responseListeEnAttente,
    fetchListeUserEnAttentDeValidation,
  } = useFetchListeUserEnAttentDeValidation();
  const { approveUser } = useApproveUserEnAttente();

  const {
    response: responsefetchStatsEligibleProf,
    fetchStatsEligibleProf,
    refreshStatsEligibleProf,
  } = useFetchStatsEligibleProf();

  const approve = async (id, u) => {
    try {
      await approveUser(id);
      await fetchListeUserEnAttentDeValidation();
      await refresh();
      showToast(`Compte de ${u.prenom} ${u.nom} validé`, "ok");
    } catch (error) {
      showToast(`Erreur: ${error.message}`, "error");
    }
  };

  return (
    <div className="w-full space-y-5">

      {/* ── Create User Modal ── */}
      {createUserModal && (
        <CreateUserModal
          onClose={() => setCreateUserModal(false)}
          onCreate={(newUser) => {
            showToast(`Utilisateur ${newUser.name} créé avec succès`, "ok");
          }}
          refresh={refresh}
          fetchListeUserEnAttentDeValidation={
            fetchListeUserEnAttentDeValidation
          }
          refreshStatsEligibleProf={refreshStatsEligibleProf}
        />
      )}

      <Header setCreateUserModal={setCreateUserModal} />
      <TabsHeader tab={tab} setTab={setTab} response={response} />
      {tab === "overview" && <Overview response={response} />}
      {tab === "pending" && (
        <Validation
          approve={approve}
          responseListeEnAttente={responseListeEnAttente}
        />
      )}
      {tab === "teachers" && (
        <TeacherStat
          responsefetchStatsEligibleProf={responsefetchStatsEligibleProf}
          fetchStatsEligibleProf={fetchStatsEligibleProf}
        />
      )}
    </div>
  );
}
