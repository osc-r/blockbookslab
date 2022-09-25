import { Input, Form, Modal as ModalAntd, message, Select } from "antd";
import styled from "styled-components";
import React, { useMemo, useState } from "react";
import { tagRender } from "../useTransactionHistoryDrawer";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Option } from "antd/lib/mentions";

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
  const labels = useSelector((state: RootState) => state.app.labels);

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
      tags: string[];
      onSubmit: ({ tags }: { tags: number[] }) => Promise<void>;
    }) => {
      const [form] = Form.useForm();

      const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        form
          .validateFields()
          .then((data) => {
            if (data && data.tags && data.tags.length > 0) {
              onSubmit({ tags: data.tags.map((i) => i.value) });
            }
            setVisible(false);
          })
          .catch((err) => console.log(err));
      };

      const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        form.resetFields();
        setVisible(false);
      };

      const children: React.ReactNode[] = [];
      for (let i = 0; i < labels.length; i++) {
        children.push(
          <Option key={labels[i].id.toString()} value={labels[i].id.toString()}>
            {labels[i].label}
          </Option>
        );
      }

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
          >
            <Form.Item name="tags" label="Tags">
              <Select
                showArrow
                tagRender={tagRender}
                mode="multiple"
                labelInValue
                defaultValue={tags.map((i) => {
                  let id = undefined;

                  labels.forEach((j) => {
                    if (j.label === i) {
                      id = j.id.toString();
                    }
                  });

                  return { label: i, value: id };
                })}
              >
                {children}
              </Select>
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
