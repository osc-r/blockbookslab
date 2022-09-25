import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";

export interface MyWalletOptions {
  chains: Chain[];
}

import UAuth from "@uauth/js";
import { UAuthConnector } from "@uauth/web3-react";
import { wallet } from "@rainbow-me/rainbowkit";

export const rainbow = ({ chains }: MyWalletOptions): Wallet => ({
  id: "my-wallet",
  name: "My Wallet",
  iconUrl: "https://my-image.xyz",
  iconBackground: "#0c2f78",
  downloadUrls: {
    android: "https://my-wallet/android",
    ios: "https://my-wallet/ios",
    qrCode: "https://my-wallet/qr",
  },
  createConnector: () => {
    // const connector = getWalletConnectConnector({ chains });

    const connector = new UAuthConnector({
      uauth: new UAuth({
        clientID: "839a5876-aad9-4c04-b2f4-bd0a089ec39a",
        redirectUri: "http://localhost:3000",
        scope: "openid wallet",
      }),
      connectors: {
        injected: wallet.injected({ chains }),
        walletconnect: wallet.walletConnect({ chains }),
      },
    });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return uri;
        },
      },
      qrCode: {
        getUri: async () => (await connector.getProvider()).connector.uri,
        instructions: {
          learnMoreUrl: "https://my-wallet/learn-more",
          steps: [
            {
              description:
                "We recommend putting My Wallet on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open the My Wallet app",
            },
            {
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
    };
  },
});
