import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


export default function PrivateRoute({children}) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}