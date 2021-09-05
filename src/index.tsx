import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';

import {
  ConfirmContext,
  confirmContext,
  ConfirmContextValue,
  ConfirmData,
  defaultDefaults
} from './context';

const GlobalConfirmModal: React.FC = () => {
  const { value, defaults, setValue } = useContext(confirmContext);
  const { isOpen } = value;

  const confirmRef = useRef<HTMLButtonElement>(null);

  const onClose = () => {
    value.data?.onClick(false);
    setValue({ data: undefined, isOpen: false });
  };

  const onClick = () => {
    value.data?.onClick(true);
    setValue({ data: undefined, isOpen: false });
  };

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

          {(value.data?.actionBody || value.data?.body) && (
            <AlertDialogBody>
              {value.data?.actionBody?.(onClose) || value.data?.body}
            </AlertDialogBody>
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
  const [value, setValue] = useState<ConfirmContextValue>({ isOpen: false });

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

export const useConfirm = (init?: BaseData) => {
  const context = useContext(confirmContext);

  return (data?: Partial<BaseData>) => {
    return new Promise<boolean>((resolve, _reject) => {
      context.setValue({
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

// experimental
export const useUNSTABLE_Alert = (init?: Partial<BaseData>) => {
  return useConfirm({
    onlyAlert: true,
    ...init
  });
};
