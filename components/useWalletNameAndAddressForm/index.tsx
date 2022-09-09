import { Input, Form, Modal as ModalAntd, message } from "antd";
import styled from "styled-components";
import React, { useMemo, useState } from "react";

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

  const WalletAddressModal = useMemo(() => {
    const ModalComponent = ({
      onSubmit,
      isAddContact,
    }: {
      isAddContact: string;
      onSubmit: ({
        name,
        address,
      }: {
        name: string;
        address: string;
      }) => Promise<void>;
    }) => {
      const [form] = Form.useForm();

      const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        form
          .validateFields()
          .then((data) => {
            onSubmit({ name: data.walletName, address: data.walletAddress });
            setVisible(false);
          })
          .catch((err) => console.log(err));
      };

      const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        form.resetFields();
        setVisible(false);
      };

      return (
        <ModalWithStyled
          title={isAddContact ? "Save Address" : "Add New Wallet"}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
          centered
          okText={"Confirm"}
        >
          <Form
            form={form}
            layout="vertical"
            name="bookmarkForm"
            autoComplete="off"
            initialValues={{ walletAddress: isAddContact }}
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
                disabled={Boolean(isAddContact)}
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
