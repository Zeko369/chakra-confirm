import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button
} from '@chakra-ui/react';
import React, { useContext, useRef } from 'react';

import { ConfirmData, confirmContext } from './context';
export { useConfirmInit, ConfirmContextProvider } from './context';

export const GlobalConfirmModal: React.FC = () => {
  const { value, setValue } = useContext(confirmContext);
  const { isOpen } = value;

  const cancelRef = useRef<HTMLButtonElement>(null);

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
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {value.data?.title || 'Are you sure?'}
          </AlertDialogHeader>

          <AlertDialogBody>{value.data?.body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onClick} ml={3}>
              {value.data?.buttonText || 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
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
    ...init,
    body: 'Are you sure you want to delete this'
  });
};
