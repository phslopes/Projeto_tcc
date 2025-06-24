import { useLocation, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5"; // Não está sendo usado, pode remover se quiser
import { MdOutlineDashboard, MdLink } from "react-icons/md";
import { FaChalkboardTeacher, FaBook, FaDoorOpen, FaCalendarAlt, FaRegCalendarCheck, FaOutdent, FaSignOutAlt, FaChartBar } from "react-icons/fa";

export default function Sidebar({ userRole }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 
    ${location.pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-800"}`;

  return (

    <aside className="w-60 h-screen bg-gray-100 text-gray-800 p-4 rounded-lg shadow-lg flex flex-col">
      <header className="pb-4 mb-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Horários</h2>
      </header>

      <nav className="flex-grow space-y-2 py-2"> 
        <ul className="space-y-2">

          {userRole === "admin" ? (
            <>
              <li>
                <Link to="/admin" className={linkClass("/admin")}>
                  <MdOutlineDashboard size={20} />
                  Início
                </Link>
              </li>
              <li>
                <Link to="/admin/professores" className={linkClass("/admin/professores")}>
                  <FaChalkboardTeacher size={20} />
                  Professores
                </Link>
              </li>
              <li>
                <Link to="/admin/disciplinas" className={linkClass("/admin/disciplinas")}>
                  <FaBook size={20} />
                  Disciplinas
                </Link>
              </li>
              <li>
                <Link to="/admin/salas" className={linkClass("/admin/salas")}>
                  <FaDoorOpen size={20} />
                  Salas
                </Link>
              </li>
              <li> {/* Cada Link deve estar dentro de um <li> para melhor semântica */}
                <Link to="/admin/associacao" className={linkClass("/admin/associacao")}>
                  <MdLink size={20} />
                  Associação
                </Link>
              </li>
              <li>
                <Link to="/admin/alocacoes" className={linkClass("/admin/alocacoes")}>
                  <FaRegCalendarCheck size={20} />
                  Alocações
                </Link>
              </li>
              <li>
                <Link to="/admin/reservaAdmin" className={linkClass("/admin/reservaAdmin")}>
                  <FaCalendarAlt size={20} />
                  Reserva
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/agenda" className={linkClass("/agenda")}>
                <FaCalendarAlt size={20} />
                Agenda
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-300">
        <Link to="/" className={linkClass("/")}>
          <FaSignOutAlt size={20} />
          Sair
        </Link>
      </div>
    </aside>
  );
}