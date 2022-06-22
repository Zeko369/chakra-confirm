import React, { createContext } from 'react';

export interface ConfirmData<T = string> {
  title?: string;
  body?: JSX.Element | string | false | null;
  label?: string;
  actionBody?: (close: () => void) => JSX.Element | false | null;
  buttonText?: string;
  buttonColor?: string;
  isCentered?: boolean;
  onlyAlert?: boolean;
  onClick: (val: boolean) => Promise<void> | void;
  size?: string;

  doubleConfirm?: boolean;
  textConfirm?: string;

  // TODO: DO THIS PROPERLY
  isValid?: false;
  defaultState?: Partial<T>;
  customBody?: React.FC<{
    state: T;
    setState: React.Dispatch<React.SetStateAction<T>>;
    onSubmit: () => unknown;
    onSubmitWithData: (data: T) => unknown;

    isFormValid: boolean;
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  }>;
}

export type PopupType = 'prompt' | 'confirm' | 'alert';
export interface ConfirmContextValue {
  type: PopupType;
  isOpen: boolean;
  isLoading: boolean;
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
  value: { type: 'confirm', isOpen: false, isLoading: false },
  setValue: () => {},
  defaults: { ...defaultDefaults }
});
