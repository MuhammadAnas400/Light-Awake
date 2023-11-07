import {useCallback, useEffect, useRef, useState} from 'react';

export const useAsync = (
  asyncFunction,
  args = [],
  deps = [],
  immediate = true,
) => {
  const isFirstUpdate = useRef(true);

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(() => {
    setLoading(true);
    setResponse(null);
    setError(null);
    return asyncFunction(...args)
      .then((response) => {
        setResponse(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [asyncFunction, args]);

  useEffect(() => {
    if (immediate) {
      execute();
    } else {
      if (!isFirstUpdate.current) {
        execute();
      }
    }
  }, [...deps]);

  useEffect(() => {
    isFirstUpdate.current = false;
  }, []);
  return {execute, response, error, loading};
};
