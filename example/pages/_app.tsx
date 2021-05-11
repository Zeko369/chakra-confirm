import React from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmContextProvider } from '../../dist';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS>
      <ConfirmContextProvider>
        <Component {...pageProps} />
      </ConfirmContextProvider>
    </ChakraProvider>
  );
};

export default MyApp;
