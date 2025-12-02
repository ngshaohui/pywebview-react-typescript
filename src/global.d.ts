interface PywebviewEvent<T> {
  detail: { key: string; value: T };
}

declare global {
  interface Window {
    pywebview: {
      api: { [index: string]: <T = any>(...args: any[]) => Promise<T> };
      platform: string;
      token: string;
      state: EventTarget;
    };
  }
}

export {};
