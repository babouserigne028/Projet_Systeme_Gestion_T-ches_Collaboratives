/* ─── Fake current users (one per role) — switch to test ───────── */
export const FAKE_USERS = {
  administrateur: {
    prenom: "Ibrahima",
    nom: "Sarr",
    email: "i.sarr@esmt.sn",
    role: "administrateur",
    avatar: "https://i.pravatar.cc/48?img=3",
  },
  professeur: {
    prenom: "Aïssatou",
    nom: "Diallo",
    email: "a.diallo@esmt.sn",
    role: "professeur",
    avatar: "https://i.pravatar.cc/48?img=47",
  },
  etudiant: {
    prenom: "Moussa",
    nom: "Ndiaye",
    email: "m.ndiaye@esmt.sn",
    role: "etudiant",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
};

export default FAKE_USERS;
