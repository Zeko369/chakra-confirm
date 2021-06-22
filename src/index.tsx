import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';

import { confirmContext, ConfirmContextValue, ConfirmData } from './context';

const GlobalConfirmModal: React.FC = () => {
  const { value, setValue } = useContext(confirmContext);
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
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {value.data?.title || 'Are you sure?'}
          </AlertDialogHeader>

          {value.data?.body && (
            <AlertDialogBody>{value.data?.body}</AlertDialogBody>
          )}

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              ref={confirmRef}
              colorScheme={value.data?.buttonColor || 'blue'}
              onClick={onClick}
              ml={3}
            >
              {value.data?.buttonText || 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export const ConfirmContextProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<ConfirmContextValue>({ isOpen: false });

  return (
    <confirmContext.Provider value={{ value, setValue }}>
      <GlobalConfirmModal />
      {children}
    </confirmContext.Provider>
  );
};

type BaseData = Omit<ConfirmData, 'onClick'>;
const defaultData = { title: 'Are you sure' };
export const useConfirm = (init: BaseData = defaultData) => {
  const context = useContext(confirmContext);

  return (data?: Partial<BaseData>) => {
    return new Promise<boolean>((resolve, _reject) => {
      context.setValue({
        isOpen: true,
        data: {
          ...init,
          ...data,
          onClick: resolve
        }
      });
    });
  };
};

export const useConfirmDelete = (init?: Partial<BaseData>) => {
  return useConfirm({
    ...defaultData,
    body: 'Are you sure you want to delete this',
    buttonText: 'Delete',
    buttonColor: 'red',
    ...init
  });
};
