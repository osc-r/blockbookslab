import { Input, Form, Modal as ModalAntd, message } from "antd";
import styled from "styled-components";
import React, { useMemo, useState } from "react";
import { ethers } from "ethers";
import Resolution from "@unstoppabledomains/resolution";
import WAValidator from "wallet-validator";

const ModalWithStyled = styled(ModalAntd)`
  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;

    border-top: none;
    padding: 0px 16px 10px;
  }
  .ant-btn-default,
  .ant-btn-primary {
    display: flex;
    border: 2px solid #d7dde5;
    border-radius: 4px;
    padding: 4px 8px;

    background: #ffffff;
    > span {
      font-family: Rubik;
      font-weight: 500;
      font-size: 14px;
      color: #d7dde5;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }
  .ant-btn-primary {
    border-color: #00c3c1;
    > span {
      color: #00c3c1;
    }
  }
`;

const useWalletNameAndAddressForm = () => {
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const resolve = async (addr: string): Promise<string | null> => {
    let err = "";

    try {
      const valid = WAValidator.validate(addr, "ethereum");
      if (valid) {
        return addr;
      }

      const resolution = new Resolution({
        sourceConfig: {
          uns: {
            locations: {
              Layer1: {
                url: "https://eth-mainnet.g.alchemy.com/v2/6tdUkHXZUeJy1VvUEAKuCVVgj9O8Z3OK",
                network: "mainnet",
              },
              Layer2: {
                url: "https://polygon-mainnet.g.alchemy.com/v2/Nn8lO4ZZrMg4sxysRc09-5EvZGoXIQ-V",
                network: "polygon-mainnet",
              },
            },
          },
        },
      });

      const uns = await resolution.addr(addr, "ETH");
      if (uns) {
        message.success("Resolve UNS name");
        return uns;
      }
    } catch (error: any) {
      if (error.code === "UnregisteredDomain") {
        err = "[Unstoppable Domains] Domain is not registered";
      } else if (error.code === "UnspecifiedResolver") {
        err = "[Unstoppable Domains] Domain is not configured (empty resolver)";
      } else if (error.code === "UnsupportedDomain") {
        err = "[Unstoppable Domains] Domain is not supported";
      }
    }

    const provider = new ethers.providers.AlchemyProvider(
      undefined,
      "6tdUkHXZUeJy1VvUEAKuCVVgj9O8Z3OK"
    );

    const ens = await provider.resolveName(addr);
    if (ens) {
      message.success("Resolve ENS name");
      return ens;
    } else {
      err = "Couldn't resolve wallet address";
      message.error(err);
    }
    console.log({ ens });
    return null;
  };

  const WalletAddressModal = useMemo(() => {
    const ModalComponent = ({
      onSubmit,
      isAddContact,
    }: {
      isAddContact: { addr: string; name: string };
      onSubmit: ({
        name,
        address,
      }: {
        name: string;
        address: string;
      }) => Promise<void>;
    }) => {
      const [form] = Form.useForm();
      const [isLoading, setIsLoading] = useState(false);

      const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        form
          .validateFields()
          .then(async (data) => {
            if (isAddContact.addr) {
              onSubmit({ name: data.walletName, address: data.walletAddress });
              setVisible(false);
              return;
            }

            setIsLoading(true);
            const resolvedAddr = await resolve(data.walletAddress);
            setIsLoading(false);
            if (resolvedAddr) {
              onSubmit({ name: data.walletName, address: resolvedAddr });
              setVisible(false);
            }
          })
          .catch((err) => console.log(err));
      };

      const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        form.resetFields();
        setVisible(false);
      };

      return (
        <ModalWithStyled
          title={isAddContact.addr ? "Save Address" : "Add New Wallet"}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{
            disabled: false,
            loading: isLoading,
          }}
          cancelButtonProps={{ disabled: isLoading }}
          centered
          okText={"Confirm"}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            name="bookmarkForm"
            autoComplete="off"
            initialValues={{
              walletAddress: isAddContact?.addr,
              walletName: isAddContact?.name,
            }}
          >
            <Form.Item
              name="walletName"
              rules={[
                {
                  required: true,
                  message: "Please input wallet name!",
                },
              ]}
            >
              <Input addonBefore="Wallet Name" />
            </Form.Item>
            <Form.Item
              name="walletAddress"
              rules={[
                {
                  required: true,
                  message: "Please input wallet address!",
                },
              ]}
            >
              <Input
                addonBefore="Wallet Address"
                disabled={Boolean(isAddContact.addr)}
                placeholder="Enter UNS, ENS or wallet address"
              />
            </Form.Item>
          </Form>
        </ModalWithStyled>
      );
    };
    return ModalComponent;
  }, [visible]);

  return { openModal: onOpen, closeModal: onClose, WalletAddressModal };
};

export default useWalletNameAndAddressForm;
