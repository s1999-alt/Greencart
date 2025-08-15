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

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/api/routes/", {
      route_id: +form.route_id,
      distance_km: +form.distance_km,
      traffic_level: form.traffic_level,
      base_time_min: +form.base_time_min
    });
    setForm({
      route_id: "",
      distance_km: "",
      traffic_level: "Low",
      base_time_min: ""
    });
    load();
  };

  const del = async (id) => {
    await API.delete(`/api/routes/${id}/`);
    load();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🛣 Routes</h2>

      {/* Add Route Form */}
      <form
        onSubmit={add}
        className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
      >
        <input
          placeholder="Route ID"
          value={form.route_id}
          onChange={(e) => setForm({ ...form, route_id: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          placeholder="Distance (km)"
          value={form.distance_km}
          onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <select
          value={form.traffic_level}
          onChange={(e) => setForm({ ...form, traffic_level: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          placeholder="Base Time (min)"
          value={form.base_time_min}
          onChange={(e) =>
            setForm({ ...form, base_time_min: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-44 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Add
        </button>
      </form>

      {/* Routes List */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {rows.length === 0 ? (
          <p className="text-gray-500">No routes found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-3"
              >
                <span className="text-gray-800 font-medium">
                  Route {r.route_id} – {r.distance_km} km – {r.traffic_level} –{" "}
                  {r.base_time_min} min
                </span>
                <button
                  onClick={() => del(r.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

