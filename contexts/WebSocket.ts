import { useEffect } from "react";
import { io } from "socket.io-client";
import { message } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const WebSocket = () => {
  const walletState = useSelector((state: RootState) => state.app.wallets);

  useEffect(() => {
    console.log({ walletState });
    const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT);

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on(
      "SYNCED_TRANSACTION_JOB",
      (data: { success: string; address: string }) => {
        const isNotify = walletState.find((i) => i.address === data.address);
        console.log({ data, isNotify });
        if (isNotify) {
          message.destroy();
          setTimeout(() => {
            message.success("Wallet has been completely synced");
          }, 700);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [walletState]);

  return null;
};

export default WebSocket;
