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

const TransactionPage = () => {
  const timerRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [transactionList, setTransactionList] = useState([]);
  const [isAddContact, setIsAddContact] = useState("");
  const [currentMemo, setCurrentMemo] = useState<string | null>("");
  const [currentTxHash, setCurrentTxHash] = useState<string | null>("");
  const [currentTag, setCurrentTag] = useState<string | null>("");

  const [connectedState, setConnectedState] = useState(false);

  const [isTxFetching, setIsTxFetching] = useState(false);

  const { WalletAddressModal, openModal, closeModal } =
    useWalletNameAndAddressForm();
  const { openDrawer, Drawer, closeDrawer } = useTransactionHistoryDrawer({
    tx_hash:
      "0xb80a8c995ebb27d8ad0b5193957f9158f50b36321313db33285720fba9fa1b7e",
    address: "0x03d15ec11110dda27df907e12e7ac996841d95e4",
    from_addr: "0x15076882d968c57deb4d4dd805f536563ea74852",
    to_addr: "0x03d15ec11110dda27df907e12e7ac996841d95e4",
    to_name: null,
    tx_value: 43173886758395115,
    tx_fee: 281532393198000,
    tx_fee_eth: 0.000281532393198,
    tx_timestamp: 1661481733,
    tx_action: null,
    tx_action_full: null,
    tx_label: null,
    tx_memo: null,
  });

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
    setIsAddContact("");
    openModal();
  };

  const onClickAddContact = (addr: string) => {
    setIsAddContact(addr);
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
    console.log({ memo });
    const res = await service.PUT_ADD_MEMO({
      txHash: currentTxHash as string,
      memo,
    });
    console.log(res.success, "asdasd");
  };

  const onSubmitTags = async ({ tags }: { tags: string }) => {
    console.log(tags);
    const res = await service.PUT_ADD_LABEL_ON_TX({
      txHash: currentTxHash as string,
      label: tags,
    });
    console.log(res.success, "asdasd");
  };

  const onSubmitContact = async ({
    name,
    address,
  }: {
    name: string;
    address: string;
  }) => {
    console.log(name, address);

    const res = await service.POST_ADD_CONTACT({
      addr: address,
      name,
    });
    console.log(res.success, "asdasd");
  };

  const getTx = useCallback(async (addr: string) => {
    const { success, data } = await service.GET_TRANSACTIONS(addr);
    if (success) {
      setTransactionList(data);
    }
    setIsTxFetching(false);
  }, []);

  const runBatch = useCallback(
    async (addr: string) => {
      setIsTxFetching(true);

      let timer: ReturnType<typeof setInterval>;

      const res = await service.POST_FETCH_TRANSACTIONS(addr);

      const callback = async () => {
        const { success, data } = await service.GET_FETCH_TRANSACTIONS_STATUS(
          addr
        );
        if (success && data.task_status === "SUCCESS") {
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
    },
    [getTx]
  );

  useEffect(() => {
    setConnectedState(isConnected);
  }, [isConnected]);

  useEffect(() => {
    const init = async () => {
      if (connectedState && address) {
        runBatch("0x03d15ec11110dda27df907e12e7ac996841d95e4");
      } else {
        setIsTxFetching(false);
        setTransactionList([]);
      }
    };
    init();
    return () => {
      timerRef.current.forEach((timer) => clearInterval(timer));
    };
  }, [address, connectedState, runBatch]);
  // const { data: ensName } = useEnsName({ address });
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });

  // if (isConnected) return <div>Connected to {ensName ?? address}</div>;
  return (
    <TransactionContainer>
      {connectedState && (
        <div className="action-wrapper">
          <button>Sort</button>
          <button>Filter</button>
          <button className="add-wallet-btn-m" onClick={onCLickAddWallet}>
            + Wallet
          </button>
        </div>
      )}
      <WalletAddressModal
        onSubmit={onSubmitContact}
        isAddContact={isAddContact}
      />
      <MemoModal onSubmit={onSubmitMemo} memo={currentMemo} />
      <TagModal onSubmit={onSubmitTags} tags={currentTag} />

      <Drawer tags={[]} isDisabled={true} updateTransaction={() => {}} />
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
          onClickRow={openDrawer}
        />
      )}
    </TransactionContainer>
  );
};

export default TransactionPage;
