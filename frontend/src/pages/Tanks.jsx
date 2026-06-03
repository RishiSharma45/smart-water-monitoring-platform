import { useEffect, useState } from "react";
import {
  createTank,
  fetchTanks,
  updateTankLevel
} from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import TankLevelBar from "../components/TankLevelBar.jsx";

function Tanks() {
  const [tanks, setTanks] = useState([]);
  const [newTank, setNewTank] = useState({ tank_name: "", water_level: 50 });
  const [selectedTankId, setSelectedTankId] = useState("");
  const [waterLevel, setWaterLevel] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTanks = async () => {
    try {
      setLoading(true);
      setTanks(await fetchTanks());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load tanks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTanks();
  }, []);

  const handleCreateTank = async (event) => {
    event.preventDefault();
    try {
      await createTank({
        tank_name: newTank.tank_name.trim(),
        water_level: Number(newTank.water_level)
      });
      setNewTank({ tank_name: "", water_level: 50 });
      setMessage("Tank created successfully.");
      await loadTanks();
    } catch (err) {
      setError(err.message || "Tank creation failed");
    }
  };

  const handleUpdateLevel = async (event) => {
    event.preventDefault();
    if (!selectedTankId) {
      setError("Select a tank before updating the level.");
      return;
    }

    try {
      await updateTankLevel(selectedTankId, waterLevel);
      setMessage("Tank level updated successfully.");
      await loadTanks();
    } catch (err) {
      setError(err.message || "Tank update failed");
    }
  };

  return (
    <section>
      <PageHeader
        eyebrow="Tank Operations"
        title="Manage Water Tanks"
        description="Create tanks, inspect live water levels, and send level updates to trigger low-water detection."
      />

      {message && <div className="success-message">{message}</div>}
      {error && <div className="alert-message">{error}</div>}

      <div className="content-grid two-column">
        <form className="panel form-panel" onSubmit={handleCreateTank}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Create</p>
              <h2>New Tank</h2>
            </div>
          </div>

          <label>
            Tank Name
            <input
              required
              value={newTank.tank_name}
              onChange={(event) =>
                setNewTank({ ...newTank, tank_name: event.target.value })
              }
              placeholder="Main Building Tank"
            />
          </label>

          <label>
            Initial Water Level
            <input
              required
              type="number"
              min="0"
              max="100"
              value={newTank.water_level}
              onChange={(event) =>
                setNewTank({ ...newTank, water_level: event.target.value })
              }
            />
          </label>

          <button className="primary-button" type="submit">
            Create Tank
          </button>
        </form>

        <form className="panel form-panel" onSubmit={handleUpdateLevel}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Update</p>
              <h2>Water Level</h2>
            </div>
          </div>

          <label>
            Select Tank
            <select
              required
              value={selectedTankId}
              onChange={(event) => setSelectedTankId(event.target.value)}
            >
              <option value="">Choose a tank</option>
              {tanks.map((tank) => (
                <option key={tank.id} value={tank.id}>
                  {tank.tank_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            New Water Level
            <input
              required
              type="number"
              min="0"
              max="100"
              value={waterLevel}
              onChange={(event) => setWaterLevel(event.target.value)}
            />
          </label>

          <button className="primary-button" type="submit">
            Update Level
          </button>
        </form>
      </div>

      <article className="panel table-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>All Tanks</h2>
          </div>
          <StatusBadge level="neutral">
            {loading ? "Loading" : `${tanks.length} Tanks`}
          </StatusBadge>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tank Name</th>
                <th>Water Level</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((tank) => (
                <tr key={tank.id}>
                  <td>#{tank.id}</td>
                  <td>{tank.tank_name}</td>
                  <td>
                    <TankLevelBar level={tank.water_level} />
                  </td>
                  <td>{new Date(tank.created_at).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge
                      level={Number(tank.water_level) < 20 ? "critical" : "healthy"}
                    >
                      {Number(tank.water_level) < 20 ? "Low" : "Normal"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default Tanks;
