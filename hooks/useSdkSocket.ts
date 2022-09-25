import { ReactNode, useEffect, useState } from "react";
import { createSocketConnection, EVENTS } from "@epnsproject/sdk-socket";
import { countUp } from "../store/notificationSlice";
import { useDispatch } from "react-redux";
import { notification } from "antd";

export type SDKSocketHookOptions = {
  account?: string | null;
  env?: string;
  chainId?: number;
  isCAIP?: boolean;
};

export const useSDKSocket = ({
  account,
  env = "",
  chainId,
  isCAIP,
}: SDKSocketHookOptions) => {
  const dispatch = useDispatch();
  const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [feedsSinceLastConnection, setFeedsSinceLastConnection] = useState<any>(
    []
  );
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(
    epnsSDKSocket?.connected
  );
  const [lastConnectionTimestamp, setLastConnectionTimestamp] = useState("");
  const Btn = () => null;

  const addSocketEvents = () => {
    epnsSDKSocket?.on(EVENTS.CONNECT, () => {
      // console.log('CONNECTED: ');
      setIsSDKSocketConnected(true);
      setLastConnectionTimestamp(new Date().toUTCString());
    });

    epnsSDKSocket?.on(EVENTS.DISCONNECT, () => {
      // console.log('DIS-CONNECTED: ');
      setIsSDKSocketConnected(false);
      setFeedsSinceLastConnection([]);
      setLastConnectionTimestamp("");
    });

    // console.log('\t-->will attach eachFeed event now');
    epnsSDKSocket?.on(EVENTS.USER_FEEDS, (feedList: any) => {
      /**
       * We receive a feed list which has 1 item.
       */
      console.log("\n\n\n\neachFeed event: ", feedList);
      dispatch(countUp());
      notification.info({
        message:
          feedList.payload.notification.title.split("blockbookslab - ")[1],
        description: feedList.payload.notification.body,
        duration: 10
      });

      // do stuff with data
      setFeedsSinceLastConnection((oldFeeds: any) => {
        return [...oldFeeds, feedList];
      });
    });
  };

  const removeSocketEvents = () => {
    // console.warn('\n--> removeSocketEvents');
    epnsSDKSocket?.off(EVENTS.CONNECT);
    epnsSDKSocket?.off(EVENTS.DISCONNECT);
    epnsSDKSocket?.off(EVENTS.USER_FEEDS);
  };

  useEffect(() => {
    if (epnsSDKSocket) {
      addSocketEvents();
    }
    return () => {
      if (epnsSDKSocket) {
        removeSocketEvents();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epnsSDKSocket]);

  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (epnsSDKSocket) {
        // console.log('=================>>> disconnection in the hook');
        epnsSDKSocket?.disconnect();
      }

      const connectionObject = createSocketConnection({
        user: account,
        env,
        socketOptions: { autoConnect: true },
      });
      // console.warn('new connection object: ', connectionObject);
      // set to context
      setEpnsSDKSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, chainId, isCAIP]);

  return {
    epnsSDKSocket,
    isSDKSocketConnected,
    feedsSinceLastConnection,
    lastConnectionTimestamp,
  };
};
