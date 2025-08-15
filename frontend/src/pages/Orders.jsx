import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [rows, setRows] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    order_id: "",
    value_rs: "",
    route: "",
    delivery_time: ""
  });

  const load = async () => {
    const { data } = await API.get("/api/orders/");
    setRows(data);
    const { data: routeData } = await API.get("/api/routes/");
    setRoutes(routeData);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/api/orders/", {
      order_id: +form.order_id,
      value_rs: +form.value_rs,
      route: form.route,
      delivery_time: form.delivery_time || null
    });
    setForm({ order_id: "", value_rs: "", route: "", delivery_time: "" });
    load();
  };

  const del = async (id) => {
    await API.delete(`/api/orders/${id}/`);
    load();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Orders</h2>

      {/* Add Order Form */}
      <form
        onSubmit={add}
        className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
      >
        <input
          placeholder="Order ID"
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-32 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          placeholder="Value (₹)"
          value={form.value_rs}
          onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <select
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Route</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              Route {r.route_id}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.delivery_time}
          onChange={(e) =>
            setForm({ ...form, delivery_time: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-56 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Add
        </button>
      </form>

      {/* Orders List */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {rows.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rows.map((o) => (
              <li
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3"
              >
                <span className="text-gray-800 font-medium">
                  Order {o.order_id} – ₹{o.value_rs} – Route {o.route} –{" "}
                  {o.delivery_time || "N/A"}
                </span>
                <button
                  onClick={() => del(o.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition mt-2 sm:mt-0"
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
