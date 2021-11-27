import React, { useState } from 'react';
import { Button, useToast, VStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useConfirm, useConfirmDelete } from '../../dist';

// const usePromp = () => {};

const Home: NextPage = () => {
  const onDefault = useConfirm();
  const onDelete = useConfirmDelete();

  const [loading, setLoading] = useState(false);
  const onConfirmAsync = useConfirm({});

  const handleAsync = async () => {
    if (await onConfirmAsync()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // const onPrompt = usePromp();

  const toast = useToast({ position: 'top-right' });
  const handleResponse = (val: boolean, data?: any) =>
    toast({
      title: val ? (data ? data : 'Main clicked') : 'Canceled',
      status: val ? 'success' : 'error'
    });

  return (
    <VStack p="4" alignItems="flex-start">
      <Button onClick={() => onDefault().then(handleResponse)}>Click</Button>
      <Button onClick={() => onDefault().then(handleAsync)}>Async</Button>
      <Button onClick={() => onDelete().then(handleResponse)} colorScheme="red">
        Delete
      </Button>
      {/* <Button onClick={() => onPrompt().then(handleResponse)}>Click</Button> */}
    </VStack>
  );
};

export default Home;
