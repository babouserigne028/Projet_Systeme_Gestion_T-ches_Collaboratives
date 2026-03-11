import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  StaticRouterProvider,
} from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import DefaultLayout from "./layout/DefaultLayout";
import PrivateRoute from "./composants/PrivateRoute";
import Dashboard from "./pages/Administrateur/Dashboard/Dashboard";
import Utilisateurs from "./pages/Administrateur/Utilisateurs/Utilisateurs";
import Statistiques from "./pages/Administrateur/Statistiques/Statiqtiques";
import Profils from "./pages/Profils/profils";
import Projets from "./pages/Administrateur/Projet/Projets";
import ProfDashboard from "./pages/Professeurs/Dashboard/Dashboard";
import ProfMesProjets from "./pages/Professeurs/MesProjets/MesProjets";
import ProfMesTaches from "./pages/Professeurs/MesTaches/MesTaches";
import EtuDashboard from "./pages/Etudiants/Dashboard/Dashboard";
import EtuMesProjets from "./pages/Etudiants/MesProjets/MesProjets";
import EtuMesTaches from "./pages/Etudiants/MesTaches/MesTaches";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <PrivateRoute
              allowedRoles={["administrateur", "professeur", "etudiant"]}
            />
          }
        >
          <Route element={<DefaultLayout />}>
            <Route path="/profil" element={<Profils />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["administrateur"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/statistiques" element={<Statistiques />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["professeur"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/prof/dashboard" element={<ProfDashboard />} />
            <Route path="/prof/mesprojets" element={<ProfMesProjets />} />
            <Route path="/prof/mestaches" element={<ProfMesTaches />} />
            <Route path="/prof/statistiques" element={<Statistiques />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["etudiant"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/etu/dashboard" element={<EtuDashboard />} />
            <Route path="/etu/mesprojets" element={<EtuMesProjets />} />
            <Route path="/etu/mestaches" element={<EtuMesTaches />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
