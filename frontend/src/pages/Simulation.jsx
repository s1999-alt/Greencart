import { useState } from "react";
import API from "../api/axios";

export default function Simulation() {
  const [form, setForm] = useState({
    num_drivers: 2,
    start_time: "09:00",
    max_hours: 8,
  });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  const run = async (e) => {
    e.preventDefault();
    setErr("");
    setRes(null);
    try {
      const { data } = await API.post("/api/simulate/", form);
      setRes(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Simulation failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🧮 Simulation</h2>


      <form
        onSubmit={run}
        className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <input
          type="number"
          min={1}
          value={form.num_drivers}
          onChange={(e) =>
            setForm({ ...form, num_drivers: +e.target.value })
          }
          placeholder="Drivers"
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="time"
          value={form.start_time}
          onChange={(e) =>
            setForm({ ...form, start_time: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="number"
          min={1}
          value={form.max_hours}
          onChange={(e) =>
            setForm({ ...form, max_hours: +e.target.value })
          }
          placeholder="Max hours/driver"
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Run Simulation
        </button>
      </form>

      {err && (
        <p className="text-red-500 mt-4 bg-red-50 border border-red-200 p-3 rounded-lg">
          {err}
        </p>
      )}

      {/* Results */}
      {res && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
          </h3>
          <p className="text-gray-700">
            <b>Efficiency:</b> {res.efficiency_score}% &nbsp;|&nbsp;
            <b>Profit:</b> ₹{res.total_profit} &nbsp;|&nbsp;
            <b>Fuel:</b> ₹{res.fuel_cost_total}
          </p>
          <p className="text-gray-700 mt-1">
            <b>On-time:</b> {res.on_time} &nbsp;|&nbsp;
            <b>Late:</b> {res.late}
          </p>
        </div>
      )}
    </div>
  );
}
