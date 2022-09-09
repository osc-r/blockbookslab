import type { AppProps } from "next/app";
import styled, { ThemeProvider, DefaultTheme } from "styled-components";
import GlobalStyle from "../components/GlobalStyled/GlobalStyled";
import { theme } from "../components/GlobalStyled/theme";
import { useRouter } from "next/router";
import AppLayout from "../layouts/AppLayout/AppLayout";
import "@rainbow-me/rainbowkit/styles.css";
import "antd/dist/antd.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.goerli,
    chain.rinkeby,
    chain.polygonMumbai,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

//

const Container = styled.div`
  flex: 1;
  background-color: #ffffff;
`;

export default function App({ Component, pageProps }: AppProps) {
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
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Container>{render()}</Container>
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
