import type { AppProps } from "next/app";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "../components/GlobalStyled/GlobalStyled";
import { theme } from "../components/GlobalStyled/theme";
import { useRouter } from "next/router";
import AppLayout from "../layouts/AppLayout/AppLayout";
import "@rainbow-me/rainbowkit/styles.css";
import "antd/dist/antd.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SiweMessage } from "siwe";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AuthenticationContext";
import { useRef, useState } from "react";
import service, { instance } from "../services/apiService";
import {
  logout,
  setAuthenticated,
  setContacts,
  setCredential,
  setLabels,
  setUnauthenticated,
  setWallets,
} from "../store/appSlice";
import WalletConnectionObserver from "../contexts/WalletConnectionObserver";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.goerli,
    chain.rinkeby,
    chain.polygonMumbai,
    chain.kovan,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Blockbooks App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const Container = styled.div`
  flex: 1;
  background-color: #ffffff;
`;

export default function App({ Component, pageProps }: AppProps) {
  const walletAddr = useRef<string | null>(null);

  const [authStatus, setAuthStatus] =
    useState<AuthenticationStatus>("unauthenticated");

  const router = useRouter();
  const pathArr = router.pathname.split("/");

  const render = () => {
    if (pathArr[1] && pathArr[1] === "app")
      return (
        <AppLayout title={pathArr[2]}>
          <Component {...pageProps} />
        </AppLayout>
      );
    return <Component {...pageProps} />;
  };

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      store.dispatch(setUnauthenticated());
      const response = await service.GET_NONCE();
      if (response.success && response.data) {
        return response.data;
      } else {
        return "";
      }
    },
    createMessage: ({ nonce, address, chainId }) => {
      walletAddr.current = address;
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to Blockbooks app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature, ...rest }) => {
      const response = await service.POST_VERIFY({
        message: message.prepareMessage(),
        signature,
      });

      const authenticated = Boolean(response.data.accessToken);
      if (!authenticated) {
        setAuthStatus("unauthenticated");
        store.dispatch(setUnauthenticated());
        return false;
      }

      const jwt = response.data.accessToken;
      instance.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      store.dispatch(setAuthenticated());
      store.dispatch(
        setCredential({
          data: {
            address: walletAddr.current,
            loginMethod: "SIWE",
            name: null,
            jwt: `Bearer ${jwt}`,
          },
        })
      );
      setAuthStatus("authenticated");

      const contacts = await service.GET_CONTACTS();
      const labels = await service.GET_LABELS();
      const wallets = await service.GET_WALLETS();

      contacts.success &&
        contacts.data &&
        store.dispatch(setContacts(contacts.data));
      labels.success && labels.data && store.dispatch(setLabels(labels.data));
      wallets.success &&
        wallets.data &&
        store.dispatch(setWallets(wallets.data));

      return Boolean(response.data);
    },
    signOut: async () => {
      store.dispatch(setUnauthenticated());
      store.dispatch(logout());
      setAuthStatus("unauthenticated");
    },
  });

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authStatus}
        >
          <RainbowKitProvider chains={chains}>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <WalletConnectionObserver />
                  <Container>{render()}</Container>
                </PersistGate>
              </Provider>
            </ThemeProvider>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </WagmiConfig>
    </>
  );
}
