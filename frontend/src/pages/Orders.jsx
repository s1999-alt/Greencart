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
  useEffect(() => { load(); }, []);

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
    <div style={{ padding: "1rem" }}>
      <h2>Orders</h2>
      <form onSubmit={add} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input placeholder="Order ID" value={form.order_id} onChange={e => setForm({ ...form, order_id: e.target.value })} />
        <input placeholder="Value (₹)" value={form.value_rs} onChange={e => setForm({ ...form, value_rs: e.target.value })} />
        <select value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}>
          <option value="">Select Route</option>
          {routes.map(r => <option key={r.id} value={r.id}>Route {r.route_id}</option>)}
        </select>
        <input type="datetime-local" value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })} />
        <button>Add</button>
      </form>
      <ul>
        {rows.map(o => (
          <li key={o.id}>
            Order {o.order_id} – ₹{o.value_rs} – Route {o.route} – {o.delivery_time || "N/A"}
            <button onClick={() => del(o.id)} style={{ marginLeft: "1rem" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
