import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/api/simulationresult/?ordering=-created_at");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLatest(res.data[0]);
        } else if (res.data.results) {
          setLatest(res.data.results[0]);
        }
      } catch (e) {
        console.error("Error fetching simulation results", e);
      }
    })();
  }, []);

  if (!latest)
    return (
      <p className="text-center text-gray-500 mt-10">
        Run a simulation to see KPIs.
      </p>
    );

  const pieData = [
    { name: "On-time", value: latest.on_time },
    { name: "Late", value: latest.late },
  ];
  const barData = [
    { name: "Profit", value: latest.total_profit },
    { name: "Fuel Cost", value: latest.fuel_cost_total },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Delivery Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Profit vs Fuel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-700">
          <b>Efficiency:</b> {latest.efficiency_score}% &nbsp; | &nbsp;
          <b>Total Profit:</b> ₹{latest.total_profit}
        </p>
      </div>
    </div>
  );
}


