import { useState } from "react";
import API from "../api/axios";

export default function Simulation(){
  const [form,setForm]=useState({num_drivers:2, start_time:"09:00", max_hours:8});
  const [res,setRes]=useState(null);
  const [err,setErr]=useState("");

  const run = async(e)=>{ e.preventDefault(); setErr(""); setRes(null);
    try{
      const {data} = await API.post("/api/simulate/", form);
      setRes(data);
    }catch(e){
      setErr(e?.response?.data?.detail || "Simulation failed");
    }
  };

  return <div style={{padding:"1rem"}}>
    <h2>Simulation</h2>
    <form onSubmit={run} style={{display:"flex", gap:"1rem", flexWrap:"wrap"}}>
      <input type="number" min={1} value={form.num_drivers} onChange={e=>setForm({...form,num_drivers:+e.target.value})} placeholder="Drivers"/>
      <input type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})}/>
      <input type="number" min={1} value={form.max_hours} onChange={e=>setForm({...form,max_hours:+e.target.value})} placeholder="Max hours/driver"/>
      <button>Run Simulation</button>
    </form>
    {err && <p style={{color:"red"}}>{err}</p>}
    {res && <div style={{marginTop:"1rem"}}>
      <h3>Results</h3>
      <p>Efficiency: {res.efficiency_score}% | Profit: ₹{res.total_profit} | Fuel: ₹{res.fuel_cost_total}</p>
      <p>On-time: {res.on_time} | Late: {res.late}</p>
    </div>}
  </div>
}