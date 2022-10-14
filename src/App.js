import { Route, Routes } from "react-router-dom";
import "./App.css";
import InitialPredictions from "./components/initial-predictions";
import Footer from "./components/layout/footer";
import Leaderboard from "./components/leaderboard";
import Scores from "./components/scores";
import Login from "./components/user/login";
import Register from "./components/user/register";
import { AuthProvider } from "./utils/auth";

const App = () => {
  return (
    <AuthProvider>
      <div
        className="App"
        // style={{
        //   height: "100vh",
        //   minheight: "100%",
        //   backgroundColor: "#f5f2f2",
        // }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/initialpredictions" element={<InitialPredictions />} />
          <Route path="/scores/:userId" element={<Scores />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
