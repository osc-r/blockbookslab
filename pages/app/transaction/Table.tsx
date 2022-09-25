import { Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { Typography } from "antd";
import { format } from "date-fns";
import Image from "next/image";
import styled from "styled-components";
import ArrowLeft from "../../../public/images/arrowLeft.svg";
import ArrowRight from "../../../public/images/arrowRight.svg";
import { ethers } from "ethers";
import LetteredAvatar from "lettered-avatar";

const { Text } = Typography;

export interface TransactionHistory {
  owner: string | null;
  tx_hash: string;
  chain_id: number;
  block_number: string;
  from_addr: string;
  to_addr: string;
  tx_timestamp: number;
  tx_value: number;
  tx_gas: number;
  tx_gas_price: number;
  tx_actions: string | null;
  rate: number;
  memo: null | string;
  labels: string[];
  contact_name: null | string;

  key?: string;
  isDeposit?: boolean;
  ensName?: string | null;
  unstoppableDomain?: string | null;
}

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const CurrencyIcon = ({ record }: { record: TransactionHistory }) => {
  const [isLoading, setIsLoading] = useState(true);

  const onError = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [record]);

  return (
    <div key={record.tx_hash}>
      {isLoading ? (
        <Image
          key={record.tx_hash}
          alt="icon"
          src={`https://cryptoicons.org/api/color/${"eth"}/600`}
          width={24}
          height={24}
          onError={onError}
        />
      ) : null}
      <Text style={{ marginLeft: 8 }}>{"ETH"}</Text>
    </div>
  );
};

/*
 0.149 => 0.15
 0.00151 => 0.0015


 else fix 4 decimal point
 */

const TableWithStyled = styled(Table)`
  .ant-table {
    margin-bottom: 64px;
  }
  .ant-table-content {
    border: 1px solid #ecedef;
    border-radius: 15px;
    overflow: hidden;
  }
  tr > th {
    font-family: Rubik;
    font-weight: 600;
    font-size: 14px;
    background: white;
    ::before {
      display: none;
    }
  }
  tr:last-child > td {
    border: none;
  }
  tbody > tr {
    max-height: 100px;
  }
  .ant-table-cell-scrollbar {
    box-shadow: none;
  }
  .ant-pagination-item {
    border: none;
    border-radius: 100%;
  }
  .ant-pagination-item-active {
    background: #00c3c1;
    a {
      color: white;
    }
  }
`;

const TableComponent = ({
  data,
  pagination,
  onClickRow,
  openModal,
  loading,
  onClickAddress,
  onClickMemo,
  onClickTag,
}: {
  data: TransactionHistory[];
  pagination?: any;
  onClickRow?: (record: TransactionHistory) => void;
  openModal?: (record: TransactionHistory) => void;
  loading?: boolean;
  onClickAddress: (addr: string, name: string) => void;
  onClickMemo: (record: TransactionHistory) => void;
  onClickTag: (record: TransactionHistory) => void;
}) => {
  const defaultColumns = [
    {
      title: "Wallet",
      dataIndex: "owner",
      width: "10%",
      render: (_: any, record: TransactionHistory) => {
        return (
          <Tooltip placement="bottomLeft" title={record.owner || "You"}>
            <span>
              <LetteredAvatar
                name={record.owner || "Y"}
                options={{
                  size: 22,
                  twoLetter: false,
                  shape: "round",
                  bgColor: "",
                  href: "",
                  target: "_blank",
                  tooltip: false,
                  tooltipTitle: "",
                  imgClass: "image-responsive user-image",
                  imgWidth: 100,
                  imgHeight: 100,
                }}
              />
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Date",
      width: "15%",
      render: (_: any, record: TransactionHistory) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ color: "#30384b" }}>
              {format(new Date(record.tx_timestamp * 1000), "d MMM yyyy")}
            </Text>
            <Text type="secondary">
              {format(
                new Date(record.tx_timestamp * 1000),
                "hh:mm aaaaa'm'"
              ).toUpperCase()}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Memo",
      width: "15%",
      dataIndex: "memo",
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickMemo(record);
          },
        };
      },
      render: (_: any, record: TransactionHistory) => {
        return record.memo ? (
          <Text style={{ color: "#30384b" }}>{record.memo}</Text>
        ) : (
          <Text style={{ color: "#D7DDE5" }}>Add Memo</Text>
        );
      },
    },
    {
      title: "Tag",
      width: "20%",
      render: (_: any, record: TransactionHistory, index: number) => {
        return (
          <React.Fragment>
            {record.tx_actions && (
              <Tag color="green" key="1">
                {record.tx_actions}
              </Tag>
            )}
            {record.labels.length > 0 ? (
              record.labels.map((label, index) => (
                <Tag color="green" key={index}>
                  {label}
                </Tag>
              ))
            ) : record.tx_actions ? null : (
              <Text style={{ color: "#D7DDE5" }}>Add Tag</Text>
            )}
          </React.Fragment>
        );
      },
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickTag(record);
          },
        };
      },
    },
    {
      title: "Amount",
      dataIndex: "tokenAmount",
      align: "right",
      width: "20%",
      render: (_: any, record: TransactionHistory) => {
        const format = (number: number, decimalPoint: number = 4) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPoint,
            maximumFractionDigits: decimalPoint,
          }).format(number);

        const RATE = format(record.rate, 2);

        const amountInEther = format(
          parseFloat(
            ethers.utils.formatUnits(record.tx_value.toString(), "ether")
          )
        );

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                color: record?.isDeposit ? "#219653" : "#d82a58",
                fontWeight: 700,
                fontFamily: "Roboto",
              }}
            >
              {record?.isDeposit ? "+" : "-"}$
              {format((record.rate * parseFloat(amountInEther)) as number)}
            </Text>
            <Text type="secondary">
              {amountInEther} ETH
              <div>({RATE} USD/ETH)</div>
            </Text>
          </div>
        );
      },
    },
    {
      title: "Address",
      width: "15%",
      render: (_: any, record: TransactionHistory) => {
        const addr = record?.isDeposit ? record.from_addr : record.to_addr;
        const resolveName = record.unstoppableDomain || record.ensName;
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {record.contact_name && (
              <Tooltip placement="bottomLeft" title={addr}>
                <Text style={{ color: "#30384b", fontWeight: "bold" }}>
                  {record.contact_name}
                </Text>
              </Tooltip>
            )}
            {(!resolveName || !record.contact_name) && (
              <Tooltip placement="bottomLeft" title={addr}>
                <Text type="secondary">
                  {`${addr.slice(0, 5)}...${addr.slice(addr.length - 4)}`}
                </Text>
              </Tooltip>
            )}
            {resolveName && (
              <Tooltip placement="bottomLeft" title={resolveName}>
                <Text
                  type="secondary"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resolveName}
                </Text>
              </Tooltip>
            )}
          </div>
        );
      },
      onCell: (record: TransactionHistory, rowIndex: number) => {
        const addr = record?.isDeposit ? record.from_addr : record.to_addr;
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickAddress(addr, record.contact_name || "");
          },
        };
      },
    },
  ];

  return (
    <TableWithStyled
      rowClassName={"editable-row"}
      dataSource={data}
      columns={defaultColumns as ColumnTypes}
      scroll={data.length > 0 ? { y: 99 * 5 } : undefined}
      // pagination={{
      //   ...pagination,
      //   position: ["bottomCenter"],
      //   defaultCurrent: 3,
      //   total: 400 - 4,
      //   showSizeChanger: false,
      //   showLessItems: true,
      //   itemRender: (_, type, original) => {
      //     if (type === "prev") {
      //       return <ArrowLeft />;
      //     }
      //     if (type === "next") {
      //       return <ArrowRight />;
      //     }
      //     return original;
      //   },
      // }}
      // rowKey="tx_hash"
      pagination={false}
      loading={loading}
      onRow={(record) => {
        return {
          onClick: () => {
            onClickRow && onClickRow(record as TransactionHistory);
          },
        };
      }}
    />
  );
};

export default TableComponent;
