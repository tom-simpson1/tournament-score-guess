import { useAuth } from "../utils/auth";
import NavigationBar from "./layout/navigation-bar";

const Scores = () => {
  const auth = useAuth();
  return (
    <>
      <NavigationBar activeKey="scores" />
      <h2 className="p-3">{auth.user?.tournamentName} - Scores</h2>
    </>
  );
};

export default Scores;
