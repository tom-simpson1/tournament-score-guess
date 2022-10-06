import "./App.css";
import InitialPredictions from "./components/initial-predictions";
import Register from "./components/user/register";

const App = () => {
  return (
    <div className="App" style={{ height: "100%", width: "100%" }}>
      <Register />
    </div>
  );
};

export default App;
