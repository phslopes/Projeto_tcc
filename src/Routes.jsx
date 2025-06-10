import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardAdmin from "./pages/Dashboard/admin";
import Salas from "./pages/salas";
import Professores from "./pages/professores";
import Disciplinas from "./pages/disciplinas";
import Reserva from "./pages/reserva";
import ProfDiscPage from "./pages/ProfessorDisc";  
import AssociacaoProfessorDisciplinaPage from "./pages/AssociacaoProfessorDisciplina/AssociacaoProfessorDisciplinaPage"; 
import StudentDashboard from "./pages/Dashboard/student";
import TeacherDashboard from "./pages/Dashboard/teacher";
import AdminLayout from "./components/AdminLayout";
import TeacherLayout from "./components/TeacherLayout";
import Associacao from "./pages/associacao";


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
          <Route path="associacao-professor-disciplina" element={<AssociacaoProfessorDisciplinaPage />} /> 
          <Route path="alocacoes" element={<ProfDiscPage />} />     
        </Route>

        {/* Rotas de student e teacher não usam esse layout */}
        <Route path="/aluno" element={<StudentDashboard />} />

        <Route path="/professor/*" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="reserva" element={<Reserva />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RoutesApp;
