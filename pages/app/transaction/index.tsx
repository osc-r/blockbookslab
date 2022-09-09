import styled from "styled-components";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const TransactionPage = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  // if (isConnected) return <div>Connected to {ensName ?? address}</div>;
  return <div style={{ display: "flex" }}></div>;
};

export default TransactionPage;
