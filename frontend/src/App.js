import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/AuthContext";
import PrivateRoute from "./components/PrivateRoute";



function Nav(){
  const { token, logout } = useAuth();
  return <nav style={{display:"flex", gap:"1rem", padding:"0.5rem", borderBottom:"1px solid #eee"}}>
    <Link to="/">Dashboard</Link>
    <Link to="/simulation">Simulation</Link>
    <Link to="/drivers">Drivers</Link>
    <Link to="/routes">Routes</Link>
    <Link to="/orders">Orders</Link>
    {token ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
  </nav>
}

export default function App(){
  return <AuthProvider>
    <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path="/simulation" element={<PrivateRoute><Simulation/></PrivateRoute>}/>
        <Route path="/drivers" element={<PrivateRoute><Drivers/></PrivateRoute>}/>
        <Route path="/routes" element={<PrivateRoute><RoutesPage/></PrivateRoute>}/>
        <Route path="/orders" element={<PrivateRoute><Orders/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
}
