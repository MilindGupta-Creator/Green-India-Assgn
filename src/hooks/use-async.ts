import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const run = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, error: null, loading: true });
    try {
      const data = await promise;
      setState({ data, error: null, loading: false });
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setState({ data: null, error: message, loading: false });
      throw err;
    }
  }, []);

  return { ...state, run };
}
