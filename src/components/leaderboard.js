import { useAuth } from "../utils/auth";
import NavigationBar from "./navigation-bar";

const Leaderboard = () => {
  const auth = useAuth();

  return (
    <>
      <NavigationBar activeKey="leaderboard" />
      <h2 className="p-3">{auth.user?.tournamentName} - Leaderboard</h2>
    </>
  );
};

export default Leaderboard;
