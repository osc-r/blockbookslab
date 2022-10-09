import {
  ConnectButton as RKConnectButton,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { Backdrop } from "../../Notification/NotificationStyled";
import ConnectButtonStyled from "./ConnectButtonStyled";
import UAuth from "@uauth/js";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setAuthenticated,
  setCredential,
  setUnauthenticated,
} from "../../../store/appSlice";
import service, { instance } from "../../../services/apiService";
import { RootState } from "../../../store/store";
import confirm from "antd/lib/modal/confirm";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ConnectButton = () => {
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const authState = useSelector((state: RootState) => state.app.authStatus);
  const credential = useSelector((state: RootState) => state.app.credential);
  const app = useSelector((state: RootState) => state.app);

  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  const onClickLogin = async () => {
    dispatch(setUnauthenticated());
    try {
      const uauth = new UAuth({
        clientID: "839a5876-aad9-4c04-b2f4-bd0a089ec39a",
        redirectUri: "http://127.0.0.1",
        scope: "openid wallet",
      });

      const authorization = await uauth.loginWithPopup();
      close();
      const account = uauth.getAuthorizationAccount(authorization);

      const response = await service.POST_VERIFY({
        message: authorization.idToken.eip4361_message!!,
        signature: authorization.idToken.eip4361_signature!!,
      });
      if (response.success) {
        const jwt = response.data.token;
        instance.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        dispatch(setAuthenticated());
        dispatch(
          setCredential({
            data: {
              address: account ? account.address : null,
              loginMethod: "UD",
              name: authorization.idToken.sub,
              jwt: `Bearer ${jwt}`,
            },
          })
        );
      }
    } catch (error) {
      dispatch(logout());
      dispatch(setUnauthenticated());
      close();

      console.error(error);
    }
  };

  const connectWallet = () => {
    close();
    openConnectModal && openConnectModal();
  };

  const onClickLogout = () => {
    confirm({
      title: "Logout?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(logout());
      },
    });
  };

  const renderButton = () => {
    if (authState === "authenticated" && credential.loginMethod === "SIWE") {
      return (
        <RKConnectButton
          label="Connect Wallet +"
          chainStatus="none"
          showBalance={false}
        />
      );
    }

    return (
      <button
        className="open-connect-modal-btn"
        onClick={credential.loginMethod === "UD" ? onClickLogout : open}
      >
        {credential.loginMethod === "UD" ? credential.name : "Connect Wallet +"}
      </button>
    );
  };

  return (
    <ConnectButtonStyled isOpen={isOpen}>
      {renderButton()}
      <Backdrop isOpen={isOpen} onClick={close}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Log in</h2>
          <button className="ud-btn" onClick={onClickLogin} />
          <button className="open-connect-modal-btn" onClick={connectWallet}>
            Connect Wallet +
          </button>
        </div>
      </Backdrop>
    </ConnectButtonStyled>
  );
};

export default ConnectButton;
