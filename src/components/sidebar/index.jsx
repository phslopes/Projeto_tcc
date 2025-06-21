import { useLocation, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDashboard, MdLink } from "react-icons/md";
import { FaChalkboardTeacher, FaBook, FaDoorOpen, FaCalendarAlt, FaRegCalendarCheck  } from "react-icons/fa";
import { useState } from "react";
import { FaChartBar } from "react-icons/fa";


export default function Sidebar({ userRole }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${location.pathname === path ? "bg-gray-300" : ""
    }`;

  return (
    
    <aside className="w-60 h-screen bg-gray-100 text-gray-800 p-4 rounded-lg shadow divide-y divide-gray-300">
      {/* Header */}
      <header className="pb-4 mb-4">
        <h2 className="text-xl font-bold">Sistema de Horários</h2>
      </header>

      {/* Navegação */}
      <nav className="space-y-4 flex-1">
        <ul className="space-y-2">

          {userRole === "admin" ? (
            <>
              <li>
                <Link to="/admin" className={linkClass("/admin")}>
                  <MdOutlineDashboard size={20} />
                  Inicio
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
              <Link to="/admin/associacao" className={linkClass("/admin/associacao")}>
                  <MdLink size={20} /> 
                  Associação 
                </Link>
              <li>
                <Link to="/admin/alocacoes" className={linkClass("/admin/alocacoes")}>
                  <FaRegCalendarCheck size={20} />
                  Alocações
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
    </aside>
  );
}