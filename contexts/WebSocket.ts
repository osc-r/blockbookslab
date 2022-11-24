import { useEffect } from "react";
import { io } from "socket.io-client";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setRefreshTx } from "../store/appSlice";

const WebSocket = () => {
  const dispatch = useDispatch();
  const walletState = useSelector((state: RootState) => state.app.wallets);

  useEffect(() => {
    let socket: any = null;

    try {
      socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT, {
        transports: ["websocket"],
        rejectUnauthorized: true,
      });

      socket.on("connect", () => {
        console.log(socket.id);
      });

      socket.on(
        "SYNCED_TRANSACTION_JOB",
        (data: { success: string; address: string }) => {
          const isNotify = walletState.find((i) => i.address === data.address);
          console.log({ data, isNotify, walletState });
          if (isNotify) {
            dispatch(setRefreshTx());
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

      socket.on("connect_error", (err: Error) => {
        console.log(`connect_error due to ${err}`);
      });
    } catch (error) {
      console.log("error => ", error);
    }

    return () => {
      socket && socket.disconnect();
    };
  }, [walletState, dispatch]);

  return null;
};

export default WebSocket;
