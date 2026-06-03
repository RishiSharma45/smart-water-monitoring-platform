import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Tanks from "./pages/Tanks.jsx";
import Alerts from "./pages/Alerts.jsx";
import SystemHealth from "./pages/SystemHealth.jsx";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/tanks", label: "Tanks" },
  { path: "/alerts", label: "Alerts" },
  { path: "/health", label: "System Health" }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SW</div>
          <div>
            <p className="brand-title">Smart Water</p>
            <p className="brand-subtitle">Monitoring Platform</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanks" element={<Tanks />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/health" element={<SystemHealth />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
