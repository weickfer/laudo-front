import { useCallback, useState } from "react";

export const useRegisterFunction = () => {
  const [storedFunction, setStoredFunction] = useState(null);

  const setFunction = useCallback((func) => {
    if(!func) {
      setStoredFunction(null)
      return
    }
    if (typeof func !== 'function') {
      throw new Error('O argumento deve ser uma função.');
    }
    setStoredFunction(() => func);
  }, []);

  // useEffect(() => {
  //   const handleUnload = () => setStoredFunction(null);

  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => window.removeEventListener("beforeunload", handleUnload);
  // }, []);

  return [storedFunction, setFunction];
};