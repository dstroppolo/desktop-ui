import React, { createContext, useContext } from 'react';

export interface RadioContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioContext = createContext<RadioContextValue | undefined>(undefined);

export const useRadioContext = () => useContext(RadioContext);

export const RadioContextProvider: React.FC<{
  value: RadioContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <RadioContext.Provider value={value}>{children}</RadioContext.Provider>
);
