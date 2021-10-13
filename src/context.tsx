import React, { createContext } from 'react';

export interface ConfirmData {
  title?: string;
  body?: JSX.Element | string | false | null;
  label?: string;
  actionBody?: (close: () => void) => JSX.Element | false | null;
  buttonText?: string;
  buttonColor?: string;
  isCentered?: boolean;
  onlyAlert?: boolean;
  onClick: (val: boolean) => Promise<void> | void;

  doubleConfirm?: boolean;
}

export type PopupType = 'prompt' | 'confirm' | 'alert';
export interface ConfirmContextValue {
  type: PopupType;
  isOpen: boolean;
  data?: ConfirmData;
}

export interface ConfirmContext {
  setValue: React.Dispatch<React.SetStateAction<ConfirmContextValue>>;
  value: ConfirmContextValue;
  defaults: Partial<
    Record<
      'prompt' | 'confirm' | 'delete',
      Pick<ConfirmData, 'title' | 'body' | 'buttonText' | 'buttonColor'>
    >
  > & { cancel: string };
}

export const defaultDefaults: ConfirmContext['defaults'] = {
  prompt: {
    title: 'Enter some data',
    buttonText: 'Submit',
    buttonColor: 'blue'
  },
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
  value: { type: 'confirm', isOpen: false },
  setValue: () => {},
  defaults: { ...defaultDefaults }
});
