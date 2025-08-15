import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Simulation from "./pages/Simulation";
import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/Routes";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";



function Nav() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-lg font-semibold hover:text-green-400 transition">
              Dashboard
            </Link>
            <Link to="/simulation" className="hover:text-green-400 transition">
              Simulation
            </Link>
            <Link to="/drivers" className="hover:text-green-400 transition">
              Drivers
            </Link>
            <Link to="/routes" className="hover:text-green-400 transition">
              Routes
            </Link>
            <Link to="/orders" className="hover:text-green-400 transition">
              Orders
            </Link>
          </div>

          {/* Right actions */}
          <div>
            {token ? (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
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
