import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthCtx = createContext(null);
export const useAuth = ()=>useContext(AuthCtx);

export default function AuthProvider({children}){
  const [token,setToken]=useState(localStorage.getItem("token"));
  const login = async (username,password)=>{
    const {data} = await API.post("/api/token/", {username,password});
    localStorage.setItem("token", data.access);
    setToken(data.access);
  };
  const logout = ()=>{ localStorage.removeItem("token"); setToken(null); };
  return <AuthCtx.Provider value={{token,login,logout}}>{children}</AuthCtx.Provider>
}