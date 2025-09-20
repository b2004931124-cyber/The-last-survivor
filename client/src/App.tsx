import { useEffect, useState } from "react";
import ZombieGame from "./components/ZombieGame";
import "@fontsource/inter";

function App() {
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    setShowGame(true);
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {showGame && <ZombieGame />}
    </div>
  );
}

export default App;
