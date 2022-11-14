import { Table, TableProps, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { StarOutlined, StarFilled, SelectOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { format } from "date-fns";
import Image from "next/image";
import styled from "styled-components";
import ArrowLeft from "../../../public/images/arrowLeft.svg";
import ArrowRight from "../../../public/images/arrowRight.svg";
import { ethers } from "ethers";
import LetteredAvatar from "lettered-avatar";
import { ExpandableConfig } from "antd/lib/table/interface";
import { ILabel } from "../../../store/appSlice";

const { Text } = Typography;

export interface TransactionHistory {
  owner: string | null;
  tx_hash: string;
  from_addr: string;
  to_addr: string;
  tx_timestamp: number;
  tx_value: string;
  tx_gas: number;
  tx_gas_price: number;
  tx_actions: string | null;
  rate: number;
  memo: null | string;
  labels: ILabel[];
  contact_name: null | string;
  type: string;
  action: string;
  tokenDecimal: string;
  symbol: string;
  tokenValue: string;

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
  .ant-table-row-expand-icon {
    padding: 0;
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
  getTx,
}: {
  data: TransactionHistory[];
  pagination?: any;
  onClickRow?: (record: TransactionHistory) => void;
  openModal?: (record: TransactionHistory) => void;
  loading?: boolean;
  onClickAddress: (addr: string, name: string) => void;
  onClickMemo: (record: TransactionHistory) => void;
  onClickTag: (record: TransactionHistory) => void;
  getTx: (current: string | number) => void;
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
        const color = (type: string) => {
          switch (type) {
            case "ERC20":
              return "cyan";
            case "ERC721":
              return "purple";
            case "ERC1155":
              return "orange";
          }
        };
        return (
          <React.Fragment>
            {record.type !== "NORMAL" && (
              <Tag color={color(record.type)} key="1">
                {record.type}
              </Tag>
            )}
            {record.labels.length > 0 ? (
              record.labels.map((label, index) => (
                <Tag color="green" key={index}>
                  {label?.name}
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
        console.log({ record });
        const format = (number: number, decimalPoint: number = 4) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPoint,
            maximumFractionDigits: decimalPoint,
          }).format(number);

        const RATE = format(record.rate, 2);

        const amountInEther =
          record.tx_value !== "null"
            ? format(
                parseFloat(
                  ethers.utils.formatUnits(
                    ethers.BigNumber.from(record.tx_value),
                    record.tokenDecimal
                  )
                )
              )
            : record.tx_value;

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
              {record?.isDeposit ? "+" : "-"}
              {["ERC721", "ERC1155"].includes(record.type)
                ? record.tokenValue
                : amountInEther}{" "}
              {record.symbol}
              {/* {format((record.rate * parseFloat(amountInEther)) as number)} */}
            </Text>
            {/* {(record.type === "ERC20" || record.type === "NORMAL") && (
              <Text type="secondary">
                {amountInEther} {record.symbol}
                <div>({RATE} USD/ETH)</div>
              </Text>
            )} */}
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
    {
      title: "",
      dataIndex: "tx_hash",
      width: "5%",

      render: (_: any, record: TransactionHistory) => {
        return (
          <a
            href={`https://etherscan.io/tx/${record.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SelectOutlined style={{ opacity: 0.3 }} />
          </a>
        );
      },
    },
  ];
  const expandable: ExpandableConfig<TransactionHistory> = {
    expandedRowRender: (record: TransactionHistory) => (
      <p style={{ margin: 0 }}>{record.action}</p>
    ),
    rowExpandable: (record: TransactionHistory) => Boolean(record.action),
  };

  const tableProps: TableProps<any> = {
    rowClassName: "editable-row",
    rowKey: (_, index) => index!!,
    onRow: (record) => {
      return {
        onClick: () => {
          onClickRow && onClickRow(record as TransactionHistory);
        },
      };
    },
    expandable,
    columns: defaultColumns as ColumnTypes,
  };

  return (
    <TableWithStyled
      dataSource={data}
      scroll={data.length > 0 ? { y: 99 * 4 } : undefined}
      pagination={{
        onChange: (page, _pageSize) => {
          getTx(page - 1);
        },
        current: pagination.current + 1,
        defaultPageSize: pagination.limit,
        position: ["bottomCenter"],
        total: pagination.totalItem,
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
      {...tableProps}
    />
  );
};

export default TableComponent;
