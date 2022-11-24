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

import Notification from "../../components/Notification/Notification";
import ConnectButton from "../../components/Button/ConnectButton/ConnectButton";

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
            <li className={clsx(pathArr[1] === "transaction" && "active")}>
              <Link href={"/transaction"}>
                <span>
                  <TransactionIcon className="icon" />
                  <span>Transaction</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(
                pathArr[1] === "transfer" && "active",
                "disabled"
              )}
            >
              <Link href={active ? "/transfer" : "#"}>
                <span>
                  <TransferIcon className="icon" />
                  <span>Transfer</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(pathArr[1] === "asset" && "active", "disabled")}
            >
              <Link href={active ? "/asset" : "#"}>
                <span>
                  <AssetIcon className="icon" />
                  <span>Asset</span>
                </span>
              </Link>
            </li>
            <li
              className={clsx(
                pathArr[1] === "analysis" && "active",
                "disabled"
              )}
            >
              <Link href={active ? "/analysis" : "#"}>
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
            <div className="button-wrapper">
              <ConnectButton />
              <Notification />
            </div>
          </div>
          {children}
        </ContentContainer>
      </div>
    </AppContainer>
  );
};

export default AppLayout;
