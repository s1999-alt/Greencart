// frontend/src/pages/Routes.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function RoutesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    route_id: "",
    distance_km: "",
    traffic_level: "Low",
    base_time_min: ""
  });

  const load = async () => {
    const { data } = await API.get("/api/routes/");
    setRows(data);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/api/routes/", {
      route_id: +form.route_id,
      distance_km: +form.distance_km,
      traffic_level: form.traffic_level,
      base_time_min: +form.base_time_min
    });
    setForm({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
    load();
  };

  const del = async (id) => {
    await API.delete(`/api/routes/${id}/`);
    load();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Routes</h2>
      <form onSubmit={add} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input placeholder="Route ID" value={form.route_id} onChange={e => setForm({ ...form, route_id: e.target.value })} />
        <input placeholder="Distance (km)" value={form.distance_km} onChange={e => setForm({ ...form, distance_km: e.target.value })} />
        <select value={form.traffic_level} onChange={e => setForm({ ...form, traffic_level: e.target.value })}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input placeholder="Base Time (min)" value={form.base_time_min} onChange={e => setForm({ ...form, base_time_min: e.target.value })} />
        <button>Add</button>
      </form>
      <ul>
        {rows.map(r => (
          <li key={r.id}>
            Route {r.route_id} – {r.distance_km} km – {r.traffic_level} – {r.base_time_min} min
            <button onClick={() => del(r.id)} style={{ marginLeft: "1rem" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
