import { useState } from "react";
import "./App.css";

import { usePythonApi, usePythonApiSimple } from "@/hooks/pythonBridge";

function App() {
  const [reply, setReply] = useState<string>("");
  const { data, isLoading, mutate } = usePythonApi<string>("hello", ["react"]);
  async function triggerPython() {
    const pythonReply = await usePythonApiSimple<string>(
      "hello",
      "react again"
    );
    setReply(pythonReply);
    mutate();
  }

  return (
    <>
      <h1>Vite + React + Pywebview</h1>
      <div className="card">
        <button onClick={triggerPython}>Talk to Python</button>
        <p>{reply}</p>
        <p>{isLoading ? <p>loading...</p> : data}</p>
      </div>
    </>
  );
}

export default App;
