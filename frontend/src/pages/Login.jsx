import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login(){
  
  const { login } = useAuth();
  const [form,setForm]=useState({username:"",password:""});
  const [err,setErr]=useState("");
  const submit=async(e)=>{e.preventDefault(); setErr("");
    try{ await login(form.username, form.password); }catch(e){ setErr("Invalid credentials"); }
  };


  return <div className="container" style={{maxWidth:400, margin:"4rem auto"}}>
    <h2>Manager Login</h2>
    <form onSubmit={submit}>
      <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button>Login</button>
      {err && <p style={{color:"red"}}>{err}</p>}
    </form>
  </div>;
}