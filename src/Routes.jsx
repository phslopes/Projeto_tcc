import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardAdmin from "./pages/Dashboard/admin";

function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  );
}
export default RoutesApp;