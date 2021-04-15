import React from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmContextProvider, GlobalConfirmModal } from '../../dist';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS>
      <ConfirmContextProvider>
        <GlobalConfirmModal />
        <Component {...pageProps} />
      </ConfirmContextProvider>
    </ChakraProvider>
  );
};

export default MyApp;
