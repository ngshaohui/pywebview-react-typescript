import { useState } from "react";
import "./App.css";

import { usePythonApi } from "@/hooks/pythonBridge";

function App() {
  const [reply, setReply] = useState<string>("");
  async function triggerPython() {
    const pythonReply = await usePythonApi<string>("hello", "react");
    setReply(pythonReply);
  }

  return (
    <>
      <h1>Vite + React + Pywebview</h1>
      <div className="card">
        <button onClick={triggerPython}>Talk to Python</button>
        <p>{reply}</p>
      </div>
    </>
  );
}

export default App;
