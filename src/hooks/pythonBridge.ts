import { useState, useEffect, useCallback } from "react";

interface PywebviewEvent<T> {
  detail: { key: string; value: T };
}

export function usePythonState<T>(propName: string) {
  const [propValue, setPropValue] = useState<T>();

  function subscribeToState() {
    window.pywebview.state.addEventListener("change", function (event) {
      const ev = event as CustomEvent<PywebviewEvent<T>["detail"]>;
      // filter out events that do not belong
      if (ev.detail.key === propName) {
        setPropValue(ev.detail.value);
      }
    });
  }

  useEffect(() => {
    if (window.pywebview) {
      subscribeToState();
    } else {
      window.addEventListener("pywebviewready", subscribeToState);
    }
  }, []);

  return propValue;
}

// interface HookOptions {
//   // TODO
//   refreshInterval: number;
// }

export function usePythonApi<T>(
  apiName: string,
  apiArgs: any[],
  // options?: HookOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (apiName === undefined) {
      return;
    }
    setIsLoading(true);
    if (!window.pywebview.api.hasOwnProperty(apiName)) {
      setError(new ReferenceError(`${apiName} is not available`));
    } else {
      const res = await window.pywebview.api[apiName]<T>(...apiArgs);
      setData(res);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // TODO: consider whether it's appropriate to add isLoading here
    if (window.pywebview) {
      fetchData();
    } else {
      window.addEventListener("pywebviewready", fetchData);
    }
  }, []);

  const mutate = useCallback(async () => {
    // similar to bound mutate in useSWR... eventually, hopefully
    return await fetchData();
  }, [fetchData]);

  return { data, error, isLoading, mutate };
}
