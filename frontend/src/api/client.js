import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 8000
});

export const fetchTanks = async () => {
  const response = await api.get("/api/tanks");
  return response.data;
};

export const createTank = async (tank) => {
  const response = await api.post("/api/tanks", tank);
  return response.data;
};

export const updateTankLevel = async (id, waterLevel) => {
  const response = await api.put(`/api/tanks/${id}`, {
    water_level: Number(waterLevel)
  });
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await api.get("/api/alerts");
  return response.data;
};

export const fetchServiceHealth = async () => {
  const services = [
    { key: "user", name: "User Service", endpoint: "/health/user" },
    { key: "tank", name: "Tank Service", endpoint: "/health/tank" },
    {
      key: "notification",
      name: "Notification Service",
      endpoint: "/health/notification"
    }
  ];

  const results = await Promise.allSettled(
    services.map(async (service) => {
      const startedAt = performance.now();
      const response = await api.get(service.endpoint);
      return {
        ...service,
        status: "Online",
        latency: Math.round(performance.now() - startedAt),
        payload: response.data
      };
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      ...services[index],
      status: "Offline",
      latency: null,
      payload: null,
      error: result.reason?.message || "Service unavailable"
    };
  });
};
