import { useAuth } from "../utils/auth";
import NavigationBar from "./layout/navigation-bar";

const Leaderboard = () => {
  const auth = useAuth();

  return (
    <>
      <NavigationBar activeKey="leaderboard" />
      <h2 className="pt-3">{auth.user?.tournamentName} - Leaderboard</h2>
    </>
  );
};

export default Leaderboard;
