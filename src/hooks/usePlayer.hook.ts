import { PlayerContext } from "~/contexts/player.context";
import { useContext } from "react";

const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(`usePlayer must be used within a PlayerProvider`);
  }

  return context;
};

export default usePlayer;
