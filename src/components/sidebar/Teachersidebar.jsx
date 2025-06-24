import { useLocation, Link } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"; // Adicionado FaSignOutAlt para o ícone Sair

export default function Teachersidebar({ userRole }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 
    ${location.pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-800"}`;

  return (

    <aside className="w-60 h-screen bg-gray-100 text-gray-800 p-4 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <header className="pb-4 mb-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Horários</h2>
      </header>

      <nav className="flex-grow space-y-2 py-2"> {/* 'flex-grow' empurra o resto do conteúdo para baixo */}
        <ul className="space-y-2">

          {userRole === "professor" ? (
            <>
              <li>
                <Link to="/professor" className={linkClass("/professor")}>
                  <MdOutlineDashboard size={20} />
                  Início
                </Link>
              </li>
              <li>
                <Link to="/professor/reserva" className={linkClass("/professor/reserva")}>
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