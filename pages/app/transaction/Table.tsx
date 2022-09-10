import { Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { Typography } from "antd";
import { format } from "date-fns";
import Image from "next/image";
import styled from "styled-components";
import ArrowLeft from "../../../public/images/arrowLeft.svg";
import ArrowRight from "../../../public/images/arrowRight.svg";

const { Text } = Typography;

export interface TransactionHistory {
  id: string;
  txHash: string;
  description: string | null;
  blockDate: string;
  fromAddress: string;
  toAddress: string;
  blockNumber: number;
  tokenSymbol: string;
  tokenAmount: string;

  tags: string[];
  type: string;
  toMemoName: string;
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
    <div key={record.id}>
      {isLoading ? (
        <Image
          key={record.id}
          alt="icon"
          src={`https://cryptoicons.org/api/color/${record.tokenSymbol.toLowerCase()}/600`}
          width={24}
          height={24}
          onError={onError}
        />
      ) : null}
      <Text style={{ marginLeft: 8 }}>{record.tokenSymbol}</Text>
    </div>
  );
};

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
  .ant-pagination-item {
    border: none;
  }
  .ant-pagination-item-active {
    border-radius: 100%;
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
  onClickMemo: (memo: string) => void;
  onClickTag: Function;
}) => {
  const defaultColumns = [
    {
      title: "Date",
      width: "15%",
      render: (_: any, record: TransactionHistory) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ color: "#30384b" }}>
              {format(new Date(record.blockDate), "d MMM yyyy")}
            </Text>
            <Text type="secondary">
              {format(
                new Date(record.blockDate),
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
            onClickMemo(`${record.description}`);
          },
        };
      },
      render: (_: any, record: TransactionHistory) => {
        return record.description ? (
          <Text style={{ color: "#30384b" }}>{record.description}</Text>
        ) : (
          <Text style={{ color: "#D7DDE5" }}>Add Memo</Text>
        );
      },
    },
    {
      title: "Tag",
      width: "15%",
      render: (_: any, record: TransactionHistory, index: number) => {
        return record.tags.length > 0 ? (
          <Tag color="green" key="1">
            {record.tags[0]}
          </Tag>
        ) : (
          <Text style={{ color: "#D7DDE5" }}>Add Tag</Text>
        );
      },
      onCell: (record: TransactionHistory, rowIndex: number) => {
        return {
          onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onClickTag();
            console.log(record, rowIndex);
          },
        };
      },
    },
    {
      title: "Amount",
      dataIndex: "tokenAmount",
      align: "right",
      width: "15%",
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
              +$24,000
            </Text>
            <Text type="secondary">12 ETH(2,000.00)</Text>
          </div>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "fromAddress", //toAddress
      width: "15%",
      render: (_: any, record: TransactionHistory) => {
        const addr =
          record.type === "in" ? record.fromAddress : record.toAddress;
        const name = record.toMemoName;
        return (
          <Tooltip placement="bottomLeft" title={addr}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ color: "#30384b", fontWeight: "bold" }}>
                {name || "Test"}
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
            onClickAddress(record.fromAddress);
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
      pagination={{
        ...pagination,
        position: ["bottomCenter"],
        defaultCurrent: 3,
        total: 500,
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
