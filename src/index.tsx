import React, { forwardRef, useContext, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  FormControl,
  Heading,
  Input,
  useBoolean
} from '@chakra-ui/react';

import {
  ConfirmContext,
  confirmContext,
  ConfirmContextValue,
  ConfirmData,
  defaultDefaults,
  PopupType
} from './context';

interface SubmitButtonProps {
  onClick: () => void;
  doubleConfirm: boolean;
  buttonProps: ButtonProps;
  children: React.ReactNode;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (props, ref) => {
    const { onClick, doubleConfirm, buttonProps, children } = props;
    const [check, { on }] = useBoolean(false);

    // useEffect(() => {
    //   if (check) {
    //     const timeout = setTimeout(off, 1000);
    //     return () => clearTimeout(timeout);
    //   }

    //   return () => {};
    // }, [check, off]);

    if (!doubleConfirm) {
      return (
        <Button ref={ref} onClick={onClick} {...buttonProps}>
          {children}
        </Button>
      );
    }

    if (check) {
      return (
        <Button ref={ref} onClick={onClick} {...buttonProps}>
          {children}
        </Button>
      );
    }

    return (
      <Button ref={ref} onClick={on} {...buttonProps} variant="outline">
        Are you sure?
      </Button>
    );
  }
);

const GlobalConfirmModal: React.FC = () => {
  const { value, defaults, setValue } = useContext(confirmContext);
  const { isOpen } = value;

  const confirmRef = useRef<any>(null);
  const [tmp, setTmp] = useState<string>('');

  const onClose = () => {
    if (value.type === 'prompt') {
      value.data?.onClick(null as any);
    } else {
      value.data?.onClick(false);
    }

    setValue((d) => ({ ...d, data: undefined, isOpen: false }));
    setTmp('');
  };

  const onClick = () => {
    if (value.type === 'prompt') {
      value.data?.onClick(tmp as any);
    } else {
      value.data?.onClick(true);
    }

    setValue((d) => ({ ...d, data: undefined, isOpen: false }));
    setTmp('');
  };

  if (!isOpen) {
    return null;
  }

  const CustomForm = value.data?.customBody;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={confirmRef}
      onClose={onClose}
      isCentered={value.data?.isCentered}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">{value.data?.title || 'Are you sure?'}</Heading>
          </AlertDialogHeader>

          {(value.data?.actionBody || value.data?.body) && (
            <AlertDialogBody>
              {value.data?.actionBody?.(onClose) || value.data?.body}
            </AlertDialogBody>
          )}

          {value.type === 'prompt' && (
            <AlertDialogBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onClick();
                }}
              >
                {CustomForm ? (
                  <CustomForm state={tmp} setState={setTmp} />
                ) : (
                  <FormControl>
                    {/*TODO*/}
                    {/*<FormLabel>{value.label}</FormLabel>*/}
                    <Input
                      ref={confirmRef}
                      value={tmp}
                      onChange={(e) => setTmp(e.target.value)}
                    />
                  </FormControl>
                )}
              </form>
            </AlertDialogBody>
          )}

          <AlertDialogFooter>
            <Button onClick={onClose}>{defaults.cancel}</Button>
            {!value.data?.onlyAlert && (
              <SubmitButton
                buttonProps={{
                  colorScheme: value.data?.buttonColor || 'blue',
                  ml: 3
                }}
                ref={value.type === 'prompt' ? null : confirmRef}
                onClick={onClick}
                doubleConfirm={value.data?.doubleConfirm || false}
              >
                {value.data?.buttonText || 'Confirm'}
              </SubmitButton>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export interface ConfirmProviderProps {
  defaults?: ConfirmContext['defaults'];
}

export const ConfirmContextProvider: React.FC<ConfirmProviderProps> = (
  props
) => {
  const { children, defaults } = props;
  const [value, setValue] = useState<ConfirmContextValue>({
    isOpen: false,
    isLoading: false,
    type: 'alert'
  });

  return (
    <confirmContext.Provider
      value={{
        value,
        setValue,
        defaults: {
          cancel: defaults?.cancel || defaultDefaults.cancel,
          confirm: { ...defaultDefaults?.confirm, ...defaults?.confirm },
          delete: { ...defaultDefaults?.delete, ...defaults?.delete }
        }
      }}
    >
      <GlobalConfirmModal />
      {children}
    </confirmContext.Provider>
  );
};

type BaseData = Omit<ConfirmData, 'onClick'>;

export const useConfirm = (init?: BaseData, type?: PopupType) => {
  const context = useContext(confirmContext);

  return (data?: Partial<BaseData>) => {
    return new Promise<boolean>((resolve, _reject) => {
      context.setValue({
        type: type || 'confirm',
        isOpen: true,
        isLoading: false,
        data: {
          ...context.defaults?.confirm,
          ...init,
          ...data,
          onClick: resolve
        }
      });
    });
  };
};

export function useConfirmDelete(init?: Partial<BaseData>) {
  const context = useContext(confirmContext);
  return useConfirm({ ...context.defaults?.delete, ...init });
}

export function usePrompt<T = string>(init?: Partial<BaseData>) {
  const context = useContext(confirmContext);
  const fn = useConfirm({ ...context.defaults?.prompt, ...init }, 'prompt');
  return (fn as unknown) as (
    data?: Partial<BaseData> | undefined
  ) => Promise<T | null>;
}

export function usePromptWithClose(init?: Partial<BaseData>) {
  const context = useContext(confirmContext);
  const fn = useConfirm({ ...context.defaults?.prompt, ...init }, 'prompt');

  return [
    (fn as unknown) as (
      data?: Partial<BaseData> | undefined
    ) => Promise<string | null>,
    context
  ] as const;
}

// experimental
export function useUNSTABLE_Alert(init?: Partial<BaseData>) {
  return useConfirm({ onlyAlert: true, ...init }, 'alert');
}
