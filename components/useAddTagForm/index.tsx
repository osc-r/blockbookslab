import { Input, Form, Modal as ModalAntd, message, Select } from "antd";
import styled from "styled-components";
import React, { useMemo, useState } from "react";
import { tagRender } from "../useTransactionHistoryDrawer";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Option } from "antd/lib/mentions";
import { ILabel, setLabels } from "../../store/appSlice";
import service from "../../services/apiService";

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
      tags: ILabel[];
      onSubmit: ({ tags }: { tags: number[] }) => Promise<void>;
    }) => {
      const dispatch = useDispatch();
      const [newLabel, setNewLabel] = useState("");

      const [form] = Form.useForm();

      const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        form
          .validateFields()
          .then((data) => {
            if (data && Array.isArray(data.tags)) {
              onSubmit({
                tags: data.tags.map((i: { value: string }) => i.value),
              });
            }
            setVisible(false);
          })
          .catch((err) => console.log(err));
      };

      const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        form.resetFields();
        setVisible(false);
      };

      const createNewLabel = async () => {
        const { success } = await service.POST_LABEL({
          name: newLabel,
        });
        if (success) {
          message.success("New label created");
          setNewLabel("");

          const labels = await service.GET_LABELS();
          labels.success && labels.data && dispatch(setLabels(labels.data));
        } else {
          message.error("Failed to create new label");
        }
      };

      const children: React.ReactNode[] = [];
      for (let i = 0; i < labels.length; i++) {
        children.push(
          <Option key={labels[i].id.toString()} value={labels[i].id.toString()}>
            {labels[i].name}
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
                onInputKeyDown={(event) => {
                  if (event.key === "Enter" && newLabel) createNewLabel();
                }}
                onSearch={(str) => setNewLabel(str)}
                onBlur={() => setNewLabel("")}
                defaultValue={tags.map((currentLabel) => {
                  // let id = undefined;

                  // labels.forEach((label) => {
                  //   if (label.name === currentLabel.name) {
                  //     id = label.id.toString();
                  //   }
                  // });

                  return { label: currentLabel.name, value: currentLabel.id };
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
  }, [visible, labels]);

  return { openModal: onOpen, closeModal: onClose, TagModal };
};

export default useAddTagForm;
