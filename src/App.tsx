import "./App.css";

import { usePythonApi } from "@/hooks/pythonBridge";

function App() {
  const { data, isLoading, error, mutate } = usePythonApi<string>("hello", [
    "react",
  ]);
  const {
    data: bData,
    isLoading: bIsLoading,
    error: bError,
    mutate: bMutate,
  } = usePythonApi<string>("non-existent", []);
  async function triggerPython() {
    mutate();
    bMutate();
  }

  return (
    <>
      <h1>Vite + React + Pywebview</h1>
      <div className="card">
        <button onClick={triggerPython}>Talk to Python</button>
        <p>{isLoading ? <p>loading...</p> : data}</p>
        {error ? (
          <p>Error while loading hello api {`${error.message}`}</p>
        ) : null}
        <p>{bIsLoading ? <p>loading...</p> : bData}</p>
        {bError ? (
          <p>Error while loading non-existent api {`${bError.message}`}</p>
        ) : null}
      </div>
    </>
  );
}

export default App;
