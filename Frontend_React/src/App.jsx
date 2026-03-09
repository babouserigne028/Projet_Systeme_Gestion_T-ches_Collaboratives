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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute allowedRoles={["administrateur"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/statistiques" element={<Statistiques />} />
            <Route path="/profil" element={<Profils />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["professeur"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/mesprojets" element={<h1> Mes Projets</h1>} />
            <Route path="/mestaches" element={<h1> Mes Taches</h1>} />
            <Route path="/statistiques" element={<h1> Mes Statistiques </h1>} />
            <Route path="/profil" element={<h1> Mon Profil</h1>} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["etudiant"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/mesprojets" element={<h1> Mes Projets</h1>} />
            <Route path="/mestaches" element={<h1> Mes Taches</h1>} />
            <Route path="/profil" element={<h1> Mon Profil</h1>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
