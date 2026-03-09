import { useState } from "react";
import CreateUserModal from "./Composants/CreateUserModal";
import Header from "./Composants/Header";
import { PENDING } from "./Composants/data/Pending";
import Toast from "./Composants/Toast";
import TabsHeader from "./Composants/TabsHeader";
import Overview from "./Composants/overview";
import Validation from "./Composants/Validation";
import TeacherStat from "./Composants/TeacherStat";
import useFetchStatUsers from "../../../services/hooks/utilisateur/useFetchStatUsers";
import useFetchListeUserEnAttentDeValidation from "../../../services/hooks/utilisateur/useFetchListeUserEnAttentDeValidation";
import useApproveUserEnAttente from "../../../services/hooks/utilisateur/useApproveUserEnAttente";

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [pending, setPending] = useState(PENDING);
  const [toast, setToast] = useState(null);
  const [createUserModal, setCreateUserModal] = useState(false);
  const { response, refresh, loading, error } = useFetchStatUsers();
  const {
    response: responseListeEnAttente,
    fetchListeUserEnAttentDeValidation,
  } = useFetchListeUserEnAttentDeValidation();
  const { approveUser } = useApproveUserEnAttente();

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

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
      {/* ── Toast ── */}
      {toast && <Toast toast={toast} />}

      {/* ── Create User Modal ── */}
      {createUserModal && (
        <CreateUserModal
          onClose={() => setCreateUserModal(false)}
          onCreate={(newUser) => {
            setPending([...pending, newUser]);
            showToast(`Utilisateur ${newUser.name} créé avec succès`, "ok");
          }}
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
      {tab === "teachers" && <TeacherStat />}
    </div>
  );
}
