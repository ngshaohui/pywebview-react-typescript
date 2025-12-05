import { useState, useEffect, useCallback } from "react";

interface PywebviewEvent<T> {
  detail: { key: string; value: T };
}

export function usePlatform() {
  const [platform, setPlatform] = useState<string | null>(null);

  const handlePywebviewReady = useCallback(() => {
    setPlatform(window.pywebview!.platform);
  }, []);

  useEffect(() => {
    if (window.pywebview) {
      handlePywebviewReady();
    } else {
      window.addEventListener("pywebviewready", handlePywebviewReady);
    }

    return () => {
      window.removeEventListener("pywebviewready", handlePywebviewReady);
    };
  }, []);

  return platform;
}

export function useWebviewToken() {
  const [token, setToken] = useState<string | null>(null);

  const handlePywebviewReady = useCallback(() => {
    setToken(window.pywebview!.token);
  }, []);

  useEffect(() => {
    if (window.pywebview) {
      handlePywebviewReady();
    } else {
      window.addEventListener("pywebviewready", handlePywebviewReady);
    }

    return () => {
      window.removeEventListener("pywebviewready", handlePywebviewReady);
    };
  }, []);

  return token;
}

export function usePythonState<T>(propName: string) {
  const [propValue, setPropValue] = useState<T | null>(null);

  const handleChangeEvent = useCallback(
    (evt: Event) => {
      const ev = evt as CustomEvent<PywebviewEvent<T>["detail"]>;
      // filter out events that do not belong
      if (ev.detail.key === propName) {
        setPropValue(ev.detail.value);
      }
    },
    [propName]
  );

  const subscribeToState = useCallback(() => {
    // TODO: docs also state that there can be the "delete" event
    window.pywebview!.state.addEventListener("change", handleChangeEvent);
  }, [handleChangeEvent]);

  useEffect(() => {
    if (window.pywebview) {
      subscribeToState();
    } else {
      window.addEventListener("pywebviewready", subscribeToState);
    }

    return () => {
      if (window.pywebview) {
        window.pywebview.state.removeEventListener("change", handleChangeEvent);
        window.removeEventListener("pywebviewready", subscribeToState);
      }
    };
  }, [subscribeToState, handleChangeEvent]);

  return propValue;
}

// interface HookOptions {
//   // TODO
//   refreshInterval: number;
// }

export function usePythonApi<T>(
  apiName: string,
  apiArgs: any[]
  // options?: HookOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  /*
   * hack for tracking dependencies
   * this means only primitives should be passed
   */
  const strArgs = JSON.stringify(apiArgs); //

  const fetchData = useCallback(async () => {
    const args = JSON.parse(strArgs);
    try {
      setIsLoading(true);
      if (!window.pywebview!.api.hasOwnProperty(apiName)) {
        setError(new ReferenceError(`${apiName} is not available`));
      } else {
        const res = await window.pywebview!.api[apiName]<T>(...args);
        setData(res);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [apiName, strArgs]);

  useEffect(() => {
    if (window.pywebview) {
      fetchData();
    } else {
      window.addEventListener("pywebviewready", fetchData);
    }

    return () => {
      window.removeEventListener("pywebviewready", fetchData);
    };
  }, [fetchData]);

  const mutate = useCallback(async () => {
    // similar to bound mutate in useSWR... eventually, hopefully
    return await fetchData();
  }, [fetchData]);

  return { data, error, isLoading, mutate };
}
