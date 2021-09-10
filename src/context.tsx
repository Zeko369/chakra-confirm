import React, { createContext } from 'react';

export interface ConfirmData {
  title?: string;
  body?: JSX.Element | string | false | null;
  actionBody?: (close: () => void) => JSX.Element | false | null;
  buttonText?: string;
  buttonColor?: string;
  isCentered?: boolean;
  onlyAlert?: boolean;
  onClick: (val: boolean) => Promise<void> | void;
}

export interface ConfirmContextValue {
  isOpen: boolean;
  data?: ConfirmData;
}

export interface ConfirmContext {
  setValue: React.Dispatch<React.SetStateAction<ConfirmContextValue>>;
  value: ConfirmContextValue;
  defaults: Partial<
    Record<
      'confirm' | 'delete',
      Pick<ConfirmData, 'title' | 'body' | 'buttonText' | 'buttonColor'>
    >
  > & { cancel: string };
}

export const defaultDefaults: ConfirmContext['defaults'] = {
  confirm: {
    title: 'Are you sure?'
  },
  delete: {
    title: 'Are you sure?',
    body: 'Are you sure you want to delete this',
    buttonText: 'Delete',
    buttonColor: 'red'
  },
  cancel: 'Cancel'
};

export const confirmContext = createContext<ConfirmContext>({
  value: { isOpen: false },
  setValue: () => {},
  defaults: { ...defaultDefaults }
});
