import styles from "./TransactionHistoryDrawer.module.css";
import React, { useMemo, useState } from "react";
import { ArrowRightOutlined, DollarCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Divider,
  Tag,
  Tooltip,
  Typography,
  Alert,
  Drawer as DrawerAntd,
  message,
} from "antd";
import { format } from "date-fns";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
// import { TransactionHistory } from "../TransactionHistoryTable";
// import { currencyFormat, weiToEther } from "../../services/numberServices";
import service from "../../services/apiService";
import { TransactionHistory } from "../../pages/app/transaction/Table";

const { Text, Title } = Typography;

const colorMapping = (label: string) => {
  switch (label) {
    case "salary":
      return "gold";
    case "deploy":
      return "geekblue";
    default:
      return "lime";
  }
};

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  console.log({ label, value });
  return (
    <Tag
      color={colorMapping(label as string)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 4, marginTop: 2, marginBottom: 2 }}
    >
      {label}
    </Tag>
  );
};

export { tagRender };

const useTransactionHistoryDrawer = (selectedTx?: TransactionHistory) => {
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const updateTransaction = async () => {
    // const response = await service.PUT_TX_HISTORY({ txs: [] });
  };

  const Drawer = useMemo(() => {
    const DrawerComponent = ({
      tags,
      updateTransaction,
      isDisabled,
    }: {
      tags: any[];
      updateTransaction: (txs: {
        description: string | null;
        tags: string[];
      }) => void;
      isDisabled: boolean;
    }) => {
      const [isLoading, setIsLoading] = useState(true);

      const onError = () => {
        setIsLoading(false);
      };

      return (
        <DrawerAntd
          key="use-transaction-history-drawer"
          title="Transaction Details"
          placement={"right"}
          width={500}
          onClose={onClose}
          visible={visible}
        >
          <Alert
            message="Information"
            description={
              <Marquee speed={30} pauseOnHover gradient={false}>
                <a
                  href={`https://etherscan.io/tx/${
                    selectedTx && selectedTx.tx_hash
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View transaction:{" "}
                  <span style={{ color: "blue" }}>{`https://etherscan.io/tx/${
                    selectedTx && selectedTx.tx_hash
                  }`}</span>
                </a>
              </Marquee>
            }
            type="info"
            showIcon
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div className={styles.currencyCol}>
              {selectedTx && (
                <Title style={{ margin: 0, marginRight: 8 }} level={2}>
                  {/* {currencyFormat(weiToEther(selectedTx.tokenAmount))}{" "} */}
                  {selectedTx?.tokenSymbol}
                </Title>
              )}
              {isLoading ? (
                <Image
                  alt="dsd"
                  src={`https://cryptoicons.org/api/color/${selectedTx?.tokenSymbol?.toLowerCase()}/600`}
                  width={42}
                  height={42}
                  onError={onError}
                />
              ) : (
                <DollarCircleOutlined
                  style={{ color: "black", fontSize: 28 }}
                />
              )}
            </div>
            <Title level={4}>Deposit Success</Title>
            <Text>
              {selectedTx &&
                format(
                  new Date(selectedTx?.tx_timestamp * 1000),
                  "dd MMM yyyy HH:mm:ss"
                )}
            </Text>
          </div>
          <br />
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Tooltip
                  placement="bottomLeft"
                  title={selectedTx && selectedTx.from_addr}
                >
                  <Input
                    readOnly
                    value={
                      selectedTx &&
                      selectedTx.from_addr &&
                      `${selectedTx.from_addr.slice(
                        0,
                        5
                      )}...${selectedTx.from_addr.slice(
                        selectedTx.from_addr.length - 4
                      )}`
                    }
                    addonBefore={"From"}
                    style={{ width: "fit-content" }}
                  />
                </Tooltip>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 54,
                  }}
                >
                  <ArrowRightOutlined style={{ color: "black" }} />
                </div>
                <Tooltip
                  placement="bottomRight"
                  title={selectedTx && selectedTx.to_addr}
                >
                  <Input
                    readOnly
                    value={
                      selectedTx &&
                      selectedTx.to_addr &&
                      `${selectedTx.to_addr.slice(
                        0,
                        5
                      )}...${selectedTx.to_addr.slice(
                        selectedTx.to_addr.length - 4
                      )}`
                    }
                    addonBefore={"To"}
                    style={{ width: "fit-content" }}
                  />
                </Tooltip>
              </div>
            </Col>
          </Row>
          <br />
          <Divider />

          <Form
            layout="vertical"
            hideRequiredMark
            autoComplete="off"
            disabled={isDisabled}
            onFinish={updateTransaction}
            initialValues={{
              description: selectedTx && selectedTx.tx_memo,
              tags: selectedTx ? [selectedTx.tx_label] : [],
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="tags" label="Tags">
                  <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}
                    defaultValue={selectedTx ? [selectedTx.tx_label] : []}
                    options={tags.map((tag) => ({ value: tag.name }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="description" label="Description">
                  <Input.TextArea
                    rows={4}
                    placeholder="(Optional) Transaction detail "
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </DrawerAntd>
      );
    };

    return DrawerComponent;
  }, [visible, selectedTx]);

  return { openDrawer: onOpen, closeDrawer: onClose, Drawer };
};
export { colorMapping };
export default useTransactionHistoryDrawer;
