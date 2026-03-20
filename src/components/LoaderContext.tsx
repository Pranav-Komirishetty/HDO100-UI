import { createContext, useContext, useState } from "react";
import Loader from "./Loader";

const LoaderContext = createContext<any>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(0);

  function showLoader(currentDay = 0) {
    setDay(currentDay);
    setLoading(true);
  }

  function hideLoader() {
    setLoading(false);
  }

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader day={day} />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}