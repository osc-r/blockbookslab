import React from "react";
import { Logo } from "../../components/Header/Header";
import {
  AppContainer,
  ContentContainer,
  SideBarContainer,
} from "./AppLayoutStyled";
import AnalysisIcon from "../../public/images/analysisIcon.svg";
import AssetIcon from "../../public/images/assetIcon.svg";
import TransferIcon from "../../public/images/transferIcon.svg";
import TransactionIcon from "../../public/images/transactionIcon.svg";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import { DoubleLeftOutlined } from "@ant-design/icons";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const AppLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const router = useRouter();
  const pathArr = router.pathname.split("/");

  const active = false;

  return (
    <AppContainer>
      <div>
        <SideBarContainer>
          <Logo iconSize={62} textSize={20} />

          <ul>
            <li className={clsx(pathArr[2] === "transaction" && "active")}>
              <Link href={"/app/transaction"}>
                <span>
                  <TransactionIcon className="icon" />
                  <span>Transaction</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(
                pathArr[2] === "transfer" && "active",
                "disabled"
              )}
            >
              <Link href={active ? "/app/transfer" : "#"}>
                <span>
                  <TransferIcon className="icon" />
                  <span>Transfer</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(pathArr[2] === "asset" && "active", "disabled")}
            >
              <Link href={active ? "/app/asset" : "#"}>
                <span>
                  <AssetIcon className="icon" />
                  <span>Asset</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(
                pathArr[2] === "analysis" && "active",
                "disabled"
              )}
            >
              <Link href={active ? "/app/analysis" : "#"}>
                <span>
                  <AnalysisIcon className="icon" />
                  <span>Analysis</span>
                </span>
              </Link>
            </li>
          </ul>
          {/* <span className="collapse">
          <DoubleLeftOutlined style={{ color: "red" }} />
          collapse
        </span> */}
        </SideBarContainer>
        <ContentContainer>
          <div className="wrapper">
            <span className="title">{title}</span>
            <ConnectButton label="Connect Wallet +" chainStatus="none" />
          </div>
          {children}
        </ContentContainer>
      </div>
    </AppContainer>
  );
};

export default AppLayout;
