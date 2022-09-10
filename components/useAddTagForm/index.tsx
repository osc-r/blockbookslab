import { Input, Form, Modal as ModalAntd, message, Select } from "antd";
import styled from "styled-components";
import React, { useMemo, useState } from "react";
import { tagRender } from "../useTransactionHistoryDrawer";

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

const useAddTagForm = () => {
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const TagModal = useMemo(() => {
    const ModalComponent = ({
      onSubmit,
      tags,
    }: {
      tags: string | null;
      onSubmit: ({ tags }: { tags: string }) => Promise<void>;
    }) => {
      const [form] = Form.useForm();

      const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        form
          .validateFields()
          .then((data) => {
            onSubmit({ tags: data.tags });
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
          title={"Tags"}
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
            initialValues={{ tags }}
          >
            <Form.Item name="tags" label="Tags">
              <Select
                showArrow
                tagRender={tagRender}
                // defaultValue={
                //   selectedTx ? selectedTx.tags.map((tag) => tag) : []
                // }
                options={[
                  { value: "Equipment" },
                  { value: "Salary" },
                  { value: "Contact" },
                ]}
              />
            </Form.Item>
          </Form>
        </ModalWithStyled>
      );
    };
    return ModalComponent;
  }, [visible]);

  return { openModal: onOpen, closeModal: onClose, TagModal };
};

export default useAddTagForm;
