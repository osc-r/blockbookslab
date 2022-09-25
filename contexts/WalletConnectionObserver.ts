import { useEffect } from "react";
import { useAccount } from "wagmi";
import { setAuthenticated, setUnauthenticated } from "../store/appSlice";
import { store } from "../store/store";

const WalletConnectionObserver = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    isConnected
      ? store.dispatch(setAuthenticated())
      : store.dispatch(setUnauthenticated());
  }, [isConnected]);

  return null;
};

export default WalletConnectionObserver;
