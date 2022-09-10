import TransactionContainer from "./transactionStyled";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useCallback, useEffect, useState, useRef } from "react";
import AddWallet from "../../../public/images/addWallet.svg";
import TableComponent, { TransactionHistory } from "./Table";
import useWalletNameAndAddressForm from "../../../components/useWalletNameAndAddressForm";
import useTxMemoForm from "../../../components/useTxMemoForm";
import service from "../../../services/apiService";
import useTransactionHistoryDrawer from "../../../components/useTransactionHistoryDrawer";
import useAddTagForm from "../../../components/useAddTagForm";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useSelector, useDispatch } from "react-redux";
import {
  addWallet,
  newAccount,
  updateWalletIsFetchBatch,
  addContact as addContactAction,
} from "../../../store/appSlice";
import { RootState } from "../../../store/store";

const TransactionPage = () => {
  const timerRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const walletState = useSelector((state: RootState) => state.app.wallet);
  const contactState = useSelector((state: RootState) => state.app.contact);
  const dispatch = useDispatch();

  const [transactionData, setTransactionData] = useState<{
    [key: string]: TransactionHistory[];
  }>({});
  const [transactionList, setTransactionList] = useState<TransactionHistory[]>(
    []
  );
  const [isAddContact, setIsAddContact] = useState<{
    addr: string;
    name: string;
  }>({ addr: "", name: "" });
  const [currentMemo, setCurrentMemo] = useState<string | null>("");
  const [currentTxHash, setCurrentTxHash] = useState<string | null>("");
  const [currentTag, setCurrentTag] = useState<string | null>("");
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
    setCurrentMemo(tx.tx_memo);
    setCurrentTxHash(tx.tx_hash);
    openMemoModal();
  };

  const onClickTags = (tx: TransactionHistory) => {
    setCurrentTag(tx.tx_label);
    setCurrentTxHash(tx.tx_hash);
    openTagModal();
  };

  const onSubmitMemo = async ({ memo }: { memo: string | null }) => {
    const res = await service.PUT_ADD_MEMO({
      txHash: currentTxHash as string,
      memo,
    });
    if (res.success) {
      refresh();
    }
  };

  const onSubmitTags = async ({ tags }: { tags: string }) => {
    const res = await service.PUT_ADD_LABEL_ON_TX({
      txHash: currentTxHash as string,
      label: tags,
    });
    if (res.success) {
      refresh();
    }
  };

  const addNewWallet = async ({
    name,
    addr,
  }: {
    name: string;
    addr: string;
  }) => {
    address &&
      dispatch(addWallet({ name, addr, account: address.toLowerCase() }));
    address && runBatch(address.toLowerCase(), addr);
  };

  const addContact = async ({ name, addr }: { name: string; addr: string }) => {
    address && dispatch(addContactAction({ name, addr, account: address }));
    // const res = await service.POST_ADD_CONTACT({
    //   addr,
    //   name,
    // });
    // if (res.success) {
    //   refresh();
    // }
  };

  const onSubmitContactForm = async ({
    name,
    address,
  }: {
    name: string;
    address: string;
  }) => {
    // return console.log({ name, address });
    isAddContact.addr === ""
      ? addNewWallet({
          name,
          addr: address.toLowerCase(),
        })
      : addContact({
          name,
          addr: address.toLowerCase(),
        });
  };

  const onClickRow = (data: TransactionHistory) => {
    setSelectedTx(data);
    openDrawer();
  };

  const getTx = useCallback(async (addr: string) => {
    const { success, data } = await service.GET_TRANSACTIONS(addr);
    if (success) {
      setTransactionData((old) => {
        const updatedState = { ...old };
        updatedState[addr] = data;
        return updatedState;
      });
    }
    setIsTxFetching(false);
  }, []);

  const runBatch = useCallback(
    async (account: string, addr: string) => {
      let isAlreadyFetchBatch = false;
      if (address && walletState[account]) {
        isAlreadyFetchBatch = Boolean(
          walletState[account].find(
            (item) => item.address?.toLowerCase() === addr.toLowerCase()
          )
        );
      }

      setIsTxFetching(true);

      let timer: ReturnType<typeof setInterval>;

      if (!isAlreadyFetchBatch) {
        const res = await service.POST_FETCH_TRANSACTIONS(addr);

        const callback = async () => {
          const { success, data } = await service.GET_FETCH_TRANSACTIONS_STATUS(
            addr
          );
          if (success && data.task_status === "SUCCESS") {
            dispatch(updateWalletIsFetchBatch({ account, addr }));
            getTx(addr);
            clearInterval(timer);
          }
        };

        if (res.success) {
          timer = setInterval(callback, 5_000);
          timerRef.current.push(timer);
        } else {
          setIsTxFetching(false);
        }
      } else {
        console.log("already fetch batch");
        getTx(addr);
      }
    },
    [getTx, address, dispatch, walletState]
  );

  const refresh = useCallback(() => {
    walletState[address?.toLowerCase() || ""]?.forEach(
      (item, i) => i > 0 && runBatch(address?.toLowerCase() || "", item.address)
    );
  }, [walletState, address, runBatch]);

  const sort = (a: TransactionHistory, b: TransactionHistory) => {
    if (a.tx_timestamp > b.tx_timestamp) {
      return -1;
    } else if (a.tx_timestamp < b.tx_timestamp) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setConnectedState(isConnected);
  }, [isConnected]);

  useEffect(() => {
    const init = async () => {
      if (connectedState && address) {
        dispatch(newAccount(address?.toLowerCase()));
        runBatch(address.toLowerCase(), address.toLowerCase());
      } else {
        setIsTxFetching(false);
      }
    };
    init();
    return () => {
      timerRef.current.forEach((timer) => clearInterval(timer));
    };
  }, [address, connectedState, runBatch, dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const list = [];
    const wallets = walletState[address?.toLowerCase() || ""]?.map((i) =>
      i.address.toLowerCase()
    );

    // console.log({ walletState, contactState });

    for (const [key, value] of Object.entries(transactionData)) {
      const mapped = value.map((item) => {
        const isReceiver = wallets?.includes(item.to_addr.toLowerCase());
        const amount = item.tx_value_eth * (isReceiver ? 1 : -1);
        const fromTo = isReceiver ? item.from_addr : item.to_addr;
        const contact = contactState[address?.toLowerCase() || ""]?.find(
          (c) => c.address.toLowerCase() === fromTo.toLowerCase()
        )?.name;

        return {
          ...item,
          // tx_value_usd: amount.toLocaleString(),

          owner: walletState[address?.toLowerCase() || ""]?.find(
            (sItem) =>
              sItem.address.toLowerCase() === item.address.toLowerCase()
          )?.name,
          fromAddressName: contact ? contact : null,
          fromAddress: fromTo,
        } as TransactionHistory;
      });
      list.push(...mapped);
    }
    setTransactionList(list.sort(sort));
  }, [transactionData, walletState, address, contactState]);
  // const { data: ensName } = useEnsName({ address });
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });

  // if (isConnected) return <div>Connected to {ensName ?? address}</div>;
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
      {!connectedState ? (
        <button className="add-wallet-btn-l" onClick={openConnectModal}>
          <AddWallet />
          <span>Add new Wallet</span>
        </button>
      ) : (
        <TableComponent
          loading={isTxFetching}
          data={transactionList}
          onClickAddress={onClickAddContact}
          onClickMemo={onClickMemo}
          onClickTag={onClickTags}
          onClickRow={onClickRow}
        />
      )}
    </TransactionContainer>
  );
};

export default TransactionPage;
