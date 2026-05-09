import React, { createContext, useContext, useState } from "react";

type LogIdContextType = {
  logId: number | null;
  setLogId: (id: number | null) => void;
};

const LogIdContext = createContext<LogIdContextType | undefined>(undefined);

export const useLogId = () => {
  const context = useContext(LogIdContext);
  if (!context) throw new Error("useLogId must be used within a LogIdProvider");
  return context;
};

export const LogIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logId, setLogId] = useState<number | null>(null);
  return (
    <LogIdContext.Provider value={{ logId, setLogId }}>
      {children}
    </LogIdContext.Provider>
  );
};

