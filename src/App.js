import { Route, Routes } from "react-router-dom";
import "./App.css";
import InitialPredictions from "./components/initial-predictions";
import RequireAuth from "./components/require-auth";
import Login from "./components/user/login";
import Register from "./components/user/register";
import { AuthProvider } from "./utils/auth";

const App = () => {
  return (
    <AuthProvider>
      <div className="App" style={{ height: "100%", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/initialpredictions" element={<InitialPredictions />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
