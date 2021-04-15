import React, { createContext, useState } from 'react';

export interface ConfirmData {
  title: string;
  body?: JSX.Element | string;
  buttonText?: string;
  onClick: (val: boolean) => Promise<void> | void;
}

export interface ConfirmContextValue {
  isOpen: boolean;
  data?: ConfirmData;
}

interface ConfirmContext {
  setValue: React.Dispatch<React.SetStateAction<ConfirmContextValue>>;
  value: ConfirmContextValue;
}

export const confirmContext = createContext<ConfirmContext>({
  value: { isOpen: false },
  setValue: () => {}
});

export const ConfirmContextProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<ConfirmContextValue>({ isOpen: false });

  return (
    <confirmContext.Provider value={{ value, setValue }}>
      {children}
    </confirmContext.Provider>
  );
};
