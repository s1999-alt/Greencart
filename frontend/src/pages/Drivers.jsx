import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Drivers(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({name:"", shift_hours:0, past_week_hours:"[8,8,8,8,8,8,8]"});

  const load=async()=>{ const {data}=await API.get("/api/drivers/"); setRows(data); }
  useEffect(()=>{ load(); },[])

  const add=async(e)=>{ e.preventDefault();
    const payload = {...form, shift_hours:+form.shift_hours, past_week_hours: JSON.parse(form.past_week_hours)};
    await API.post("/api/drivers/", payload); setForm({name:"",shift_hours:0,past_week_hours:"[8,8,8,8,8,8,8]"}); load();
  }
  const del=async(id)=>{ await API.delete(`/api/drivers/${id}/`); load(); }

  return <div style={{padding:"1rem"}}>
    <h2>Drivers</h2>
    <form onSubmit={add} style={{display:"flex", gap:"0.5rem", flexWrap:"wrap"}}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input type="number" placeholder="Shift Hours" value={form.shift_hours} onChange={e=>setForm({...form,shift_hours:e.target.value})}/>
      <input placeholder='Past week hours JSON' value={form.past_week_hours} onChange={e=>setForm({...form,past_week_hours:e.target.value})}/>
      <button>Add</button>
    </form>
    <ul>
      {rows.map(d=> <li key={d.id}>{d.name} ({d.shift_hours}h) <button onClick={()=>del(d.id)}>Delete</button></li>)}
    </ul>
  </div>
}
