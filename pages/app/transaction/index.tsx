import TransactionContainer from "./transactionStyled";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useCallback, useEffect, useState } from "react";
import AddWallet from "../../../public/images/addWallet.svg";
import TableComponent from "./Table";
import useWalletNameAndAddressForm from "../../../components/useWalletNameAndAddressForm";
import useTxMemoForm from "../../../components/useTxMemoForm";
import service from "../../../services/apiService";
import useTransactionHistoryDrawer from "../../../components/useTransactionHistoryDrawer";
import useAddTagForm from "../../../components/useAddTagForm";

const TransactionPage = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [isAddContact, setIsAddContact] = useState("");
  const [currentMemo, setCurrentMemo] = useState("");

  const [isTxFetching, setIsTxFetching] = useState(false);

  const { WalletAddressModal, openModal, closeModal } =
    useWalletNameAndAddressForm();
  const { openDrawer, Drawer, closeDrawer } = useTransactionHistoryDrawer({
    id: "b26d6b7b-69fc-4c05-8ba4-20551c4c7ae9",
    txHash:
      "0xed980aee9b563af6fc2be47c643ce8d57500c32764aae16931a625897c4d8187",
    description: "",
    blockDate: "2022-08-12T07:40:20.000Z",
    fromAddress: "0x4fb8bbbdc0da1b607ceb337bb70dd33a97f65aca",
    toAddress: "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
    blockNumber: 14925529,
    tokenSymbol: "ETH",
    tokenAmount: "0",
    tags: [],
    type: "",
    toMemoName: "",
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

  const onClickMemo = (memo: string) => {
    setCurrentMemo(memo);
    openMemoModal();
  };

  const { address, isConnected } = useAccount();

  const getTx = useCallback(async () => {
    setIsTxFetching(true);

    if (address) {
      const { success, data } = await service.GET_TRANSACTIONS(address);
      if (success) {
        setTransactionList(data);
      }
      setIsTxFetching(false);
    }
  }, [address]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const init = async () => {
      if (isConnected && address) {
        setIsTxFetching(true);

        const res = await service.POST_FETCH_TRANSACTIONS(address);

        const callback = async () => {
          const { success, data } = await service.GET_FETCH_TRANSACTIONS_STATUS(
            address
          );
          if (success && data.task_status === "SUCCESS") {
            getTx();
            clearInterval(timer);
          }
        };

        if (res.success) {
          timer = setInterval(callback, 30_000);
        }
      } else {
        setIsTxFetching(false);
      }
    };

    init();
    console.log({ address, isConnected });

    return () => {
      timer && clearInterval(timer);
    };
  }, [address, isConnected, getTx]);
  // const { data: ensName } = useEnsName({ address });
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });

  // if (isConnected) return <div>Connected to {ensName ?? address}</div>;
  return (
    <TransactionContainer>
      <div className="action-wrapper">
        <button>Sort</button>
        <button>Filter</button>
        <button className="add-wallet-btn-m" onClick={onCLickAddWallet}>
          + Wallet
        </button>
      </div>
      <WalletAddressModal
        onSubmit={async ({ name }) => {
          console.log(name);
        }}
        isAddContact={isAddContact}
      />
      <MemoModal
        onSubmit={async ({ memo }) => {
          console.log(memo);
        }}
        memo={currentMemo}
      />
      <TagModal
        onSubmit={async ({ memo }) => {
          console.log(memo);
        }}
        memo={currentMemo}
      />

      <Drawer tags={[]} isDisabled={true} updateTransaction={() => {}} />
      {/* <button className="add-wallet-btn-l">
        <AddWallet />
        <span>Add new Wallet</span>
      </button> */}

      <TableComponent
        data={[
          {
            id: "b26d6b7b-69fc-4c05-8ba4-20551c4c7ae9",
            txHash:
              "0xed980aee9b563af6fc2be47c643ce8d57500c32764aae16931a625897c4d8187",
            description: "",
            blockDate: "2022-08-12T07:40:20.000Z",
            fromAddress: "0x4fb8bbbdc0da1b607ceb337bb70dd33a97f65aca",
            toAddress: "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
            blockNumber: 14925529,
            tokenSymbol: "ETH",
            tokenAmount: "0",
            tags: [],
            type: "",
            toMemoName: "",
          },
          {
            id: "b26d6b7b-69fc-4c05-8ba4-20551c4c7ae9",
            txHash:
              "0xed980aee9b563af6fc2be47c643ce8d57500c32764aae16931a625897c4d8187",
            description: "test",
            blockDate: "2022-06-08T07:40:20.000Z",
            fromAddress: "0x4fb8bbbdc0da1b607ceb337bb70dd33a97f65aca",
            toAddress: "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
            blockNumber: 14925529,
            tokenSymbol: "ETH",
            tokenAmount: "0",
            tags: ["Deposit"],
            type: "",
            toMemoName: "",
          },
        ]}
        onClickAddress={onClickAddContact}
        onClickMemo={onClickMemo}
        onClickTag={openTagModal}
        onClickRow={openDrawer}
      />
    </TransactionContainer>
  );
};

export default TransactionPage;
