import { useEffect, useState } from "react";
import { fetchServiceHealth } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function SystemHealth() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    setServices(await fetchServiceHealth());
    setLoading(false);
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

      <button className="secondary-button" type="button" onClick={loadHealth}>
        Refresh Status
      </button>
    </section>
  );
}

export default SystemHealth;
