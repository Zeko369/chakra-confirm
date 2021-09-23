import React, { useContext, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input
} from '@chakra-ui/react';

import {
  ConfirmContext,
  confirmContext,
  ConfirmContextValue,
  ConfirmData,
  defaultDefaults,
  PopupType
} from './context';

const GlobalConfirmModal: React.FC = () => {
  const { value, defaults, setValue } = useContext(confirmContext);
  const { isOpen } = value;

  const confirmRef = useRef<HTMLButtonElement>(null);

  const onClose = () => {
    if (value.type === 'prompt') {
      value.data?.onClick(null as any);
    } else {
      value.data?.onClick(false);
    }

    setValue((d) => ({ ...d, data: undefined, isOpen: false }));
  };

  const onClick = () => {
    if (value.type === 'prompt') {
      value.data?.onClick(tmp as any);
    } else {
      value.data?.onClick(true);
    }

    setValue((d) => ({ ...d, data: undefined, isOpen: false }));
  };

  const [tmp, setTmp] = useState<string>('');

  if (!isOpen) {
    return null;
  }

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

          {value.type === 'prompt' ? (
            <AlertDialogBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onClick();
                }}
              >
                <FormControl>
                  <FormLabel></FormLabel>
                  <Input value={tmp} onChange={(e) => setTmp(e.target.value)} />
                </FormControl>
              </form>
            </AlertDialogBody>
          ) : (
            (value.data?.actionBody || value.data?.body) && (
              <AlertDialogBody>
                {value.data?.actionBody?.(onClose) || value.data?.body}
              </AlertDialogBody>
            )
          )}

          <AlertDialogFooter>
            <Button onClick={onClose}>{defaults.cancel}</Button>
            {!value.data?.onlyAlert && (
              <Button
                ref={confirmRef}
                colorScheme={value.data?.buttonColor || 'blue'}
                onClick={onClick}
                ml={3}
              >
                {value.data?.buttonText || 'Confirm'}
              </Button>
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

export const useConfirmDelete = (init?: Partial<BaseData>) => {
  const context = useContext(confirmContext);
  return useConfirm({ ...context.defaults?.delete, ...init });
};

export const usePrompt = (init?: Partial<BaseData>) => {
  const context = useContext(confirmContext);
  const fn = useConfirm({ ...context.defaults?.prompt, ...init }, 'prompt');
  return (fn as unknown) as (
    data?: Partial<BaseData> | undefined
  ) => Promise<string | null>;
};

// experimental
export const useUNSTABLE_Alert = (init?: Partial<BaseData>) => {
  return useConfirm({ onlyAlert: true, ...init }, 'alert');
};
