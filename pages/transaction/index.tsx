import TransactionContainer from "./transactionStyled";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import TableComponent, { TransactionHistory } from "./Table";
import useWalletNameAndAddressForm from "../../components/useWalletNameAndAddressForm";
import useTxMemoForm from "../../components/useTxMemoForm";
import service from "../../services/apiService";
import useTransactionHistoryDrawer from "../../components/useTransactionHistoryDrawer";
import useAddTagForm from "../../components/useAddTagForm";

import { useDispatch, useSelector } from "react-redux";
import { ILabel, setWallets } from "../../store/appSlice";
import { RootState } from "../../store/store";
import { ethers } from "ethers";
import Resolution from "@unstoppabledomains/resolution";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { message } from "antd";
import { wallet } from "@rainbow-me/rainbowkit";

const TransactionPage = () => {
  const { isConnected } = useAccount();
  const dispatch = useDispatch();

  const refreshTx = useSelector(
    (state: RootState) => state.app.refreshTransaction
  );
  const authState = useSelector((state: RootState) => state.app.authStatus);
  const credential = useSelector((state: RootState) => state.app.credential);
  const walletState = useSelector((state: RootState) => state.app.wallets);
  const contactState = useSelector((state: RootState) => state.app.contacts);

  const [transactionList, setTransactionList] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: "0",
    limit: "30",
    totalItem: 0,
  });

  const [isAddContact, setIsAddContact] = useState<{
    addr: string;
    name: string;
  }>({ addr: "", name: "" });
  const [currentMemo, setCurrentMemo] = useState<string | null>("");
  const [currentTxHash, setCurrentTxHash] = useState<string | null>("");
  const [currentTag, setCurrentTag] = useState<ILabel[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory>();

  const [connectedState, setConnectedState] = useState(false);

  const [isTxFetching, setIsTxFetching] = useState(false);

  const { WalletAddressModal, openModal, closeModal } =
    useWalletNameAndAddressForm();
  const { openDrawer, Drawer, closeDrawer } =
    useTransactionHistoryDrawer(selectedTx);

  const {
    MemoModal,
    openModal: openMemoModal,
    closeModal: closeMemoModal,
  } = useTxMemoForm();

  const {
    TagModal,
    openModal: openTagModal,
    closeModal: closeTagModal,
  } = useAddTagForm();

  const onCLickAddWallet = () => {
    setIsAddContact({ addr: "", name: "" });
    openModal();
  };

  const onClickAddContact = (addr: string, name: string) => {
    setIsAddContact({ addr, name });
    openModal();
  };

  const onClickMemo = (tx: TransactionHistory) => {
    setCurrentMemo(tx.memo);
    setCurrentTxHash(tx.tx_hash);
    openMemoModal();
  };

  const onClickTags = (tx: TransactionHistory) => {
    setCurrentMemo(tx.memo);
    setCurrentTag(tx.labels);
    setCurrentTxHash(tx.tx_hash);
    openTagModal();
  };

  const onClickRow = (data: TransactionHistory) => {
    // setSelectedTx(data);
    // openDrawer();
  };

  const onSubmitMemo = async ({ memo }: { memo: string | null }) => {
    const response = await service.POST_TX_MEMO({
      txHash: currentTxHash as string,
      memo,
    });
    response.success && getTx();
  };

  const onSubmitTags = async ({ tags }: { tags: number[] }) => {
    const response = await service.POST_TX_LABELS({
      txHash: currentTxHash as string,
      labels: tags,
    });
    response.success && getTx();
  };

  const onSubmitContactForm = async ({
    name,
    address,
  }: {
    name: string;
    address: string;
  }) => {
    if (isAddContact.addr === "") {
      const result = await service.POST_WALLET({
        userAddress: address,
        name,
      });
      if (result.success) {
        message.loading("Syncing wallet transactions", 0);
      } else {
        message.error("This wallet address has been added");
      }

      const wallets = await service.GET_WALLETS();
      wallets.success && wallets.data && dispatch(setWallets(wallets.data));
    } else {
      const response = await service.POST_CONTACT({
        userAddress: address,
        name,
      });
      response.success && getTx();
    }
  };

  useEffect(() => {
    if (credential.loginMethod === "SIWE" || credential.loginMethod === null) {
      setConnectedState(isConnected);
    }
    if (credential.loginMethod === "UD") {
      if (credential.address) {
        setConnectedState(true);
      } else {
        setConnectedState(false);
      }
    }
  }, [isConnected, credential]);

  const getTx = useCallback(
    async (current?: string | number) => {
      setIsTxFetching(true);
      if (
        connectedState &&
        credential.address &&
        authState === "authenticated"
      ) {
        let { success, data } = await service.GET_TRANSACTIONS({
          current: current ? current.toString() : "0",
          limit: "30",
        });

        if (success && data) {
          const provider = new ethers.providers.AlchemyProvider(
            undefined,
            "6tdUkHXZUeJy1VvUEAKuCVVgj9O8Z3OK"
          );
          const mapped: TransactionHistory[] = [];
          const addr: string[] = [];
          const myMap = new Map<
            string,
            { ensName?: string | null; unstoppableDomain?: string | null }
          >();

          // data.forEach((item) => {
          //   const indexFrom = addr.findIndex((i) => i === item.from_addr);
          //   const indexTo = addr.findIndex((i) => i === item.to_addr);
          //   if (indexFrom === -1) {
          //     addr.push(item.from_addr);
          //   }
          //   if (indexTo === -1) {
          //     addr.push(item.to_addr);
          //   }
          // });

          // const resolution = new Resolution({
          //   sourceConfig: {
          //     uns: {
          //       locations: {
          //         Layer1: {
          //           url: "https://eth-mainnet.g.alchemy.com/v2/6tdUkHXZUeJy1VvUEAKuCVVgj9O8Z3OK",
          //           network: "mainnet",
          //         },
          //         Layer2: {
          //           url: "https://polygon-mainnet.g.alchemy.com/v2/Nn8lO4ZZrMg4sxysRc09-5EvZGoXIQ-V",
          //           network: "polygon-mainnet",
          //         },
          //       },
          //     },
          //   },
          // });

          // addr.push("0x88bc9b6c56743a38223335fac05825d9355e9f83");

          // const pm = addr.map(async (i) => {
          //   let ensName, unstoppableDomain;

          //   try {
          //     const domain = await resolution.reverseTokenId(i);
          //     const res = await axios.get(
          //       `https://metadata.unstoppabledomains.com/metadata/${domain}`
          //     );
          //     if (res.data.name) {
          //       unstoppableDomain = res.data.name;
          //     } else {
          //       ensName = await provider.lookupAddress(i);
          //     }
          //     myMap.set(i, { ensName, unstoppableDomain });
          //     return true;
          //   } catch (error) {
          //     console.log("ERR ==> ", error);
          //     return false;
          //   }
          // });

          // await Promise.all(pm);

          //   ensName = myMap.get(
          //     isDeposit ? item.from_addr : item.to_addr
          //   )?.ensName;

          //   unstoppableDomain = myMap.get(
          //     isDeposit ? item.from_addr : item.to_addr
          //   )?.unstoppableDomain;

          //   mapped.push({
          //     ...item,
          //     key: x.toString(),
          //     unstoppableDomain,
          //     ensName,
          //   });
          // }
          // setTransactionList(mapped);
          setTransactionList(
            data.txList.map((item, index) => {
              return {
                ...item,
                key: index,
                unstoppableDomain: null,
                ensName: null,
              };
            })
          );
          setPagination(data.pagination);
        } else {
          setTransactionList([]);
        }
        setIsTxFetching(false);
        return;
      }
      setTransactionList([]);
      setIsTxFetching(false);
    },
    [connectedState, credential.address, authState]
  );

  useEffect(() => {
    getTx();
  }, [getTx, refreshTx]);

  const downloadCSV = async () => {
    console.log("download");
    const res = await service.GET_CSV();
    console.log(res);

    const href = URL.createObjectURL(res.data);

    // create "a" HTLM element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "transaction.csv"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <TransactionContainer>
      {connectedState && (
        <div className="action-wrapper">
          <button disabled>Sort</button>
          <button disabled>Filter</button>
          <button className="add-wallet-btn-m" onClick={onCLickAddWallet}>
            + Wallet
          </button>
        </div>
      )}
      <WalletAddressModal
        onSubmit={onSubmitContactForm}
        isAddContact={isAddContact}
      />
      <MemoModal onSubmit={onSubmitMemo} memo={currentMemo} />
      <TagModal onSubmit={onSubmitTags} tags={currentTag} />

      <Drawer tags={[]} isDisabled={false} updateTransaction={() => {}} />
      {connectedState && authState === "authenticated" ? (
        <TableComponent
          loading={isTxFetching}
          data={transactionList}
          onClickAddress={onClickAddContact}
          onClickMemo={onClickMemo}
          onClickTag={onClickTags}
          onClickRow={onClickRow}
          pagination={pagination}
          getTx={getTx}
        />
      ) : (
        <Carousel
          autoPlay
          infiniteLoop
          stopOnHover
          showIndicators={false}
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          interval={2500}
        >
          <div style={{ width: "100%", height: "250px" }}>
            <Image
              src="/images/app1.png"
              alt="app1"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div style={{ width: "100%", height: "250px" }}>
            <Image
              src="/images/app2.jpg"
              alt="app2"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div style={{ width: "100%", height: "250px" }}>
            <Image
              src="/images/app3.jpg"
              alt="app3"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div style={{ width: "100%", height: "250px" }}>
            <Image
              src="/images/app4.jpg"
              alt="app4"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Carousel>
      )}
      {connectedState &&
        authState === "authenticated" &&
        transactionList.length > 0 && (
          <button
            disabled
            className="add-wallet-btn-m csv"
            onClick={downloadCSV}
          >
            CSV
          </button>
        )}
    </TransactionContainer>
  );
};

export default TransactionPage;
