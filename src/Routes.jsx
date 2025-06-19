import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importe Navigate
import LoginPage from "./pages/login";
import DashboardAdmin from "./pages/Dashboard/admin";
import Salas from "./pages/salas";
import Professores from "./pages/professores";
import Disciplinas from "./pages/disciplinas";
import Reserva from "./pages/reserva";
import ProfDiscPage from "./pages/ProfessorDisc";  
// import AssociacaoProfessorDisciplinaPage from "./pages/AssociacaoProfessorDisciplina/AssociacaoProfessorDisciplinaPage"; 
import StudentDashboard from "./pages/Dashboard/student";
import TeacherDashboard from "./pages/Dashboard/teacher";
import AdminLayout from "./components/AdminLayout";
import TeacherLayout from "./components/TeacherLayout";
import PrivateRoute from "./components/PrivateRoute"; 
import AlocacoesPage from "./pages/alocacao";


function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="professores" element={<Professores />} />
            <Route path="disciplinas" element={<Disciplinas />} />
            <Route path="salas" element={<Salas />} />
            {/* <Route path="associacao-professor-disciplina" element={<AssociacaoProfessorDisciplinaPage />} />  */}
            <Route path="ProfessorDisc" element={<ProfDiscPage />} />  
            <Route path="alocacoes" element={<AlocacoesPage />} />   
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        {/* Rotas de Aluno */}
        <Route element={<PrivateRoute allowedRoles={['aluno']} />}>
          <Route path="/aluno" element={<StudentDashboard />} />
        </Route>

        {/* Rotas de Professor*/}
        <Route element={<PrivateRoute allowedRoles={['professor']} />}>
          <Route path="/professor" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="reserva" element={<Reserva />} />
            <Route path="*" element={<Navigate to="/professor" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default RoutesApp;