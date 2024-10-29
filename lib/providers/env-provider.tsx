"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface EnvContextType {
  isWebContainer: boolean;
  envMode: string | undefined;
}

const EnvContext = createContext<EnvContextType>({
  isWebContainer: false,
  envMode: undefined,
});

export function EnvProvider({ children }: { children: React.ReactNode }) {
  const [envState, setEnvState] = useState<EnvContextType>({
    isWebContainer: false,
    envMode: undefined,
  });

  useEffect(() => {
    const envMode = process.env.NEXT_PUBLIC_ENV_MODE;
    setEnvState({
      isWebContainer: envMode === 'webcontainer',
      envMode,
    });
  }, []);

  return (
    <EnvContext.Provider value={envState}>
      {children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  const context = useContext(EnvContext);
  if (context === undefined) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
}