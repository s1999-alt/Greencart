import { useEffect, useState } from "react";
import API from "../api/axios";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Dashboard(){
  const [latest,setLatest] = useState(null);

  useEffect(()=> {
    (async()=>{
      try {
        const res = await API.get("/api/simulationresult/?ordering=-created_at");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLatest(res.data[0]);
        } else if (res.data.results) { // in case pagination is enabled
          setLatest(res.data.results[0]);
        }
      } catch(e) {
        console.error("Error fetching simulation results", e);
      }
    })();
  }, []);

  if(!latest) return <p>Run a simulation to see KPIs.</p>;

  const pieData = [
    {name:"On-time", value: latest.on_time},
    {name:"Late", value: latest.late},
  ];
  const barData = [
    {name:"Profit", value: latest.total_profit},
    {name:"Fuel Cost", value: latest.fuel_cost_total},
  ];

  return (
    <div style={{padding:"1rem"}}>
      <h2>Dashboard</h2>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        <div>
          <h3>Delivery Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label />
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3>Profit vs Fuel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p><b>Efficiency:</b> {latest.efficiency_score}% | <b>Total Profit:</b> ₹{latest.total_profit}</p>
    </div>
  );
}

