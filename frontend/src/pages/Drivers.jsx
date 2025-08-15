import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Drivers() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    name: "",
    shift_hours: 0,
    past_week_hours: "[8,8,8,8,8,8,8]",
  });

  const load = async () => {
    const { data } = await API.get("/api/drivers/");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      shift_hours: +form.shift_hours,
      past_week_hours: JSON.parse(form.past_week_hours),
    };
    await API.post("/api/drivers/", payload);
    setForm({
      name: "",
      shift_hours: 0,
      past_week_hours: "[8,8,8,8,8,8,8]",
    });
    load();
  };

  const del = async (id) => {
    await API.delete(`/api/drivers/${id}/`);
    load();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🚚 Drivers</h2>

      {/* Add Driver Form */}
      <form
        onSubmit={add}
        className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Shift Hours"
          value={form.shift_hours}
          onChange={(e) =>
            setForm({ ...form, shift_hours: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          placeholder="Past week hours JSON"
          value={form.past_week_hours}
          onChange={(e) =>
            setForm({ ...form, past_week_hours: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Add
        </button>
      </form>

      {/* Drivers List */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {rows.length === 0 ? (
          <p className="text-gray-500">No drivers found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rows.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between py-3"
              >
                <span className="text-gray-800 font-medium">
                  {d.name} <span className="text-gray-500">({d.shift_hours}h)</span>
                </span>
                <button
                  onClick={() => del(d.id)}
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
