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

const { Text } = Typography;

export interface TransactionHistory {
  tx_hash: string;
  address: string;
  from_addr: string;
  to_addr: string;
  to_name: string | null;
  tx_value: number;
  tx_fee: number;
  tx_fee_eth: number;
  tx_timestamp: number;
  tx_action: string | null;
  tx_action_full: string | null;
  tx_label: string | null;
  tx_memo: string | null;
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
          src={`https://cryptoicons.org/api/color/${record?.tokenSymbol?.toLowerCase()}/600`}
          width={24}
          height={24}
          onError={onError}
        />
      ) : null}
      <Text style={{ marginLeft: 8 }}>{record?.tokenSymbol}</Text>
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
  onClickAddress: (addr: string) => void;
  onClickMemo: (record: TransactionHistory) => void;
  onClickTag: (record: TransactionHistory) => void;
}) => {
  const defaultColumns = [
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
      dataIndex: "description",
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickMemo(record);
          },
        };
      },
      render: (_: any, record: TransactionHistory) => {
        return record.tx_memo ? (
          <Text style={{ color: "#30384b" }}>{record.tx_memo}</Text>
        ) : (
          <Text style={{ color: "#D7DDE5" }}>Add Memo</Text>
        );
      },
    },
    {
      title: "Tag",
      width: "15%",
      render: (_: any, record: TransactionHistory, index: number) => {
        return record.tx_label ? (
          <Tag color="green" key="1">
            {record.tx_label}
          </Tag>
        ) : (
          <Text style={{ color: "#D7DDE5" }}>Add Tag</Text>
        );
      },
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickTag(record);
            console.log(record, rowIndex);
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
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                color: "#219653",
                fontWeight: 700,
                fontFamily: "Roboto",
              }}
            >
              +$
              {(
                Number(ethers.utils.formatEther(record.tx_value.toString())) *
                1600
              ).toFixed(8)}
            </Text>
            <Text type="secondary">
              {Number(
                ethers.utils.formatEther(record.tx_value.toString())
              ).toFixed(8)}{" "}
              ETH ({(1600).toFixed(2)} USD/ETH)
            </Text>
          </div>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "fromAddress", //toAddress
      width: "15%",
      render: (_: any, record: TransactionHistory) => {
        const addr = record?.type === "in" ? record.from_addr : record.to_addr;
        const name = record.to_addr;
        return (
          <Tooltip placement="bottomLeft" title={addr}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ color: "#30384b", fontWeight: "bold" }}>
                {/* {name || "Test"} */}
              </Text>
              <Text type="secondary">
                {`${addr.slice(0, 5)}...${addr.slice(addr.length - 4)}`}
              </Text>
            </div>
          </Tooltip>
        );
      },
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickAddress(record.from_addr);
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
      pagination={{
        ...pagination,
        position: ["bottomCenter"],
        defaultCurrent: 3,
        total: 400 - 4,
        showSizeChanger: false,
        showLessItems: true,
        itemRender: (_, type, original) => {
          if (type === "prev") {
            return <ArrowLeft />;
          }
          if (type === "next") {
            return <ArrowRight />;
          }
          return original;
        },
      }}
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
