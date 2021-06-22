import React, { createContext } from 'react';

export interface ConfirmData {
  title: string;
  body?: JSX.Element | string | null;
  buttonText?: string;
  buttonColor?: string;
  isCentered?: boolean;
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
