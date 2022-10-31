import { Route, Routes } from "react-router-dom";
import "./App.css";
import InitialPredictions from "./components/initial-predictions";
import Footer from "./components/layout/footer";
import Leaderboard from "./components/leaderboard";
import Scores from "./components/scores";
import Login from "./components/user/login";
import Register from "./components/user/register";
import { AuthProvider } from "./utils/auth";
import { QueryClient, QueryClientProvider } from "react-query";
import ForgotUsername from "./components/user/forgot-username";
import ForgotPassword from "./components/user/forgot-password";
import ResetPassword from "./components/user/reset-password";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/forgotusername" element={<ForgotUsername />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route
              path="/initialpredictions"
              element={<InitialPredictions />}
            />
            <Route path="/scores" element={<Scores />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
