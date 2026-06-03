import { useEffect, useMemo, useState } from "react";
import { fetchAlerts, fetchTanks } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import TankLevelBar from "../components/TankLevelBar.jsx";

function Dashboard() {
  const [tanks, setTanks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [tankData, alertData] = await Promise.all([
          fetchTanks(),
          fetchAlerts()
        ]);
        setTanks(tankData);
        setAlerts(alertData);
        setError("");
      } catch (err) {
        setError(err.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const averageWaterLevel = useMemo(() => {
    if (tanks.length === 0) return 0;
    const total = tanks.reduce((sum, tank) => sum + Number(tank.water_level), 0);
    return Math.round(total / tanks.length);
  }, [tanks]);

  const activeLowAlerts = alerts.filter(
    (alert) => alert.alert_type === "LOW_WATER_LEVEL"
  ).length;

  const lowTanks = tanks.filter((tank) => Number(tank.water_level) < 20);

  return (
    <section>
      <PageHeader
        eyebrow="Operations Overview"
        title="Water Monitoring Dashboard"
        description="Track tank capacity, low-water alerts, and platform readiness from one control surface."
      />

      {error && <div className="alert-message">{error}</div>}

      <div className="stats-grid">
        <StatCard
          label="Total Tanks"
          value={loading ? "..." : tanks.length}
          hint="Registered in database"
        />
        <StatCard
          label="Average Water Level"
          value={loading ? "..." : `${averageWaterLevel}%`}
          hint="Across all tanks"
          tone={averageWaterLevel < 30 ? "danger" : "good"}
        />
        <StatCard
          label="Active Low Water Alerts"
          value={loading ? "..." : activeLowAlerts}
          hint="Generated alert events"
          tone={activeLowAlerts > 0 ? "danger" : "good"}
        />
      </div>

      <div className="content-grid two-column">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Tank Status</p>
              <h2>Current Levels</h2>
            </div>
            <StatusBadge level={lowTanks.length ? "critical" : "healthy"}>
              {lowTanks.length ? "Attention Needed" : "Stable"}
            </StatusBadge>
          </div>

          <div className="list-stack">
            {tanks.length === 0 && !loading ? (
              <p className="empty-state">No tanks are available yet.</p>
            ) : (
              tanks.slice(0, 5).map((tank) => (
                <div className="level-row" key={tank.id}>
                  <div>
                    <strong>{tank.tank_name}</strong>
                    <span>Tank #{tank.id}</span>
                  </div>
                  <TankLevelBar level={tank.water_level} />
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Alerts</p>
              <h2>Recent Low Water Events</h2>
            </div>
          </div>

          <div className="list-stack">
            {alerts.length === 0 && !loading ? (
              <p className="empty-state">No alerts have been recorded.</p>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div className="alert-row" key={alert.id}>
                  <div>
                    <strong>{alert.tank_name}</strong>
                    <span>{new Date(alert.created_at).toLocaleString()}</span>
                  </div>
                  <StatusBadge level="critical">{alert.water_level}%</StatusBadge>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
