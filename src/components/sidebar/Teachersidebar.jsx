import { useLocation, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { FaChalkboardTeacher, FaBook, FaDoorOpen, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import { FaChartBar } from "react-icons/fa";



export default function Teachersidebar({ userRole }) {
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

          {userRole === "professor" ? (
            <>
              <li>
                <Link to="/professor" className={linkClass("/professor")}>
                  <MdOutlineDashboard size={20} />
                  Inicio
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
    </aside>
  );
}
