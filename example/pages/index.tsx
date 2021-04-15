import React from 'react';
import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  useToast
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';

import { useConfirm, useConfirmDelete } from '../../dist';

const Home: NextPage = () => {
  const onDefault = useConfirm();
  const onDelete = useConfirmDelete();

  const toast = useToast();
  const handleResponse = (val: boolean) =>
    toast({
      title: val ? 'Main clicked' : 'Canceled',
      status: val ? 'success' : 'error'
    });

  return (
    <VStack p="4" alignItems="flex-start">
      <Button onClick={() => onDefault().then(handleResponse)}>Click</Button>
      <Button onClick={() => onDelete().then(handleResponse)} colorScheme="red">
        Delete
      </Button>
    </VStack>
  );
};

export default Home;
