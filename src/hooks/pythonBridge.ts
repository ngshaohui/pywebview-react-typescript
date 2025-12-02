import { useState, useEffect } from "react";

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

export async function usePythonApi<T>(
  apiName: string,
  ...rest: any[]
): Promise<T> {
  // window.pywebview.api = window.pywebview.api || {};
  // TODO: check if api attribute is defined if no window.expose or js_api is set
  // TODO: can change this to hold state similar to useSWR
  const res = await window.pywebview.api[apiName]<T>(...rest);
  return res;
}
