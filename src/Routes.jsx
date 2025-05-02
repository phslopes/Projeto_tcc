import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardAdmin from "./pages/Dashboard/admin";
// import Sidebar from "./components/sidebar";
import Salas from "./pages/salas";
import Professores from "./pages/professores";
import Disciplinas from "./pages/disciplinas";
import StudentDashboard from "./pages/Dashboard/student";
import TeacherDashboard from "./pages/Dashboard/teacher";
import AdminLayout from "./components/AdminLayout";

function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Layout de Admin: tudo que for /admin/* renderiza dentro do AdminLayout */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="professores" element={<Professores />} />
          <Route path="disciplinas" element={<Disciplinas />} />
          <Route path="salas" element={<Salas />} />
          {/* redireciona qualquer outra sub-rota de /admin de volta ao dashboard */}
        </Route>

        {/* Rotas de student e teacher não usam esse layout */}
        <Route path="/aluno" element={<StudentDashboard />} />
        <Route path="/professor" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}
export default RoutesApp;