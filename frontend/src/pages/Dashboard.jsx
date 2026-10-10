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
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [tankData, alertData] = await Promise.all([
        fetchTanks(),
        fetchAlerts()
      ]);
      setTanks(tankData);
      setAlerts(alertData);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const averageWaterLevel = useMemo(() => {
    if (tanks.length === 0) return 0;
    const total = tanks.reduce((sum, tank) => sum + Number(tank.water_level), 0);
    return Math.round(total / tanks.length);
  }, [tanks]);

  const totalAlertEvents = alerts.length;

  const lowTanks = tanks.filter((tank) => Number(tank.water_level) < 20);
  const healthyTanks = tanks.filter((tank) => Number(tank.water_level) >= 50);
  const warningTanks = tanks.filter(
    (tank) => Number(tank.water_level) >= 20 && Number(tank.water_level) < 50
  );

  const recentAlerts = useMemo(() => {
    return [...alerts]
      .sort((a, b) => {
        const timeA = a.created_at ? Date.parse(a.created_at) : 0;
        const timeB = b.created_at ? Date.parse(b.created_at) : 0;
        if (timeA !== timeB) return timeB - timeA;
        return (b.id || 0) - (a.id || 0);
      })
      .slice(0, 5);
  }, [alerts]);

  return (
    <section>
      <div className="page-toolbar">
        <PageHeader
          eyebrow="Operations Overview"
          title="Water Monitoring Dashboard - Build Test"
          description="Track tank capacity, low-water alerts, and platform readiness from one control surface."
        />
        <button className="secondary-button" type="button" onClick={loadDashboard}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert-message">{error}</div>}

      <div className="ops-strip">
        <div>
          <span>Healthy</span>
          <strong>{healthyTanks.length}</strong>
        </div>
        <div>
          <span>Warning</span>
          <strong>{warningTanks.length}</strong>
        </div>
        <div>
          <span>Critical</span>
          <strong>{lowTanks.length}</strong>
        </div>
        <div>
          <span>Last Updated</span>
          <strong>{lastUpdated ? lastUpdated.toLocaleTimeString() : "Pending"}</strong>
        </div>
      </div>

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
          label="Total Alert Events"
          value={loading ? "..." : totalAlertEvents}
          hint="Recorded in alert history"
          tone={totalAlertEvents > 0 ? "danger" : "good"}
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
              tanks.map((tank) => (
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
            {recentAlerts.length === 0 && !loading ? (
              <p className="empty-state">No alerts have been recorded.</p>
            ) : (
              recentAlerts.map((alert) => (
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
