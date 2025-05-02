import { useLocation, Link } from "react-router-dom";

export default function Sidebar({ userRole }) {
  const location = useLocation();

  const linkClass = (path) =>
    `sidebar-link${location.pathname === path ? " active" : ""}`;

  return (
    <aside className="sidebar open">
      <header className="sidebar-header">
        <h2>Sistema de Horários</h2>
      </header>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={linkClass("/")}>
              <span className="icon">🏠</span> Início
            </Link>
          </li>

          {userRole === "admin" ? (
            <>
              <li>
                <Link to="/admin" className={linkClass("/admin")}>
                  <span className="icon">📊</span> Dashboard Admin
                </Link>
              </li>
              <li>
                <Link to="/admin/professores" className={linkClass("/admin/professores")}>
                  <span className="icon">👥</span> Professores
                </Link>
              </li>
              <li>
                <Link to="/admin/disciplinas" className={linkClass("/admin/disciplinas")}>
                  <span className="icon">📚</span> Disciplinas
                </Link>
              </li>
              <li>
                <Link to="/admin/salas" className={linkClass("/admin/salas")}>
                  <span className="icon">🚪</span> Salas
                </Link>
              </li>
            </>
          ) : (
            // ainda não implementado mas pode ser usado para o aluno e professor
            <li>
              <Link to="/agenda" className={linkClass("/agenda")}>
                <span className="icon">🗓️</span> Agenda
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
