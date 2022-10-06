import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

const RequireAuth = ({ children }) => {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAuth;
