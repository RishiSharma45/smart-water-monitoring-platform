import { useEffect, useState } from "react";
import { fetchServiceHealth } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function SystemHealth() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHealth = async () => {
    try {
      setLoading(true);
      setServices(await fetchServiceHealth());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to check system health");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <section>
      <PageHeader
        eyebrow="Platform Status"
        title="System Health"
        description="Check whether the user, tank, and notification backend services are reachable from the frontend."
      />

      {error && <div className="alert-message">{error}</div>}

      <div className="health-grid">
        {services.map((service) => (
          <article className="panel health-card" key={service.key}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">{service.endpoint}</p>
                <h2>{service.name}</h2>
              </div>
              <StatusBadge
                level={service.status === "Online" ? "healthy" : "critical"}
              >
                {service.status}
              </StatusBadge>
            </div>

            <div className="health-meta">
              <span>Latency</span>
              <strong>
                {service.latency === null ? "Unavailable" : `${service.latency} ms`}
              </strong>
            </div>

            <pre>{JSON.stringify(service.payload || service.error, null, 2)}</pre>
          </article>
        ))}
      </div>

      {loading && <p className="empty-state">Checking service health...</p>}

      <div className="button-row">
        <button className="secondary-button" type="button" onClick={loadHealth}>
          {loading ? "Checking..." : "Refresh Status"}
        </button>
      </div>
    </section>
  );
}

export default SystemHealth;
