import { BellOutlined } from "@ant-design/icons";
import {
  Backdrop,
  NotificationBox,
  NotificationButton,
} from "./NotificationStyled";

import * as EpnsAPI from "@epnsproject/sdk-restapi";
import { useCallback, useEffect, useState } from "react";

import { useSigner } from "wagmi";
import { useSDKSocket } from "../../hooks/useSdkSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clear } from "../../store/notificationSlice";
import { Card, Result } from "antd";
import { Logo } from "../Header/Header";
import { SmileOutlined } from "@ant-design/icons";

const NOTIFICATION_CHANNEL_ADDR =
  process.env.NEXT_PUBLIC_NOTIFICATION_CHANNEL_ADDR;
const NOTIFICATION_ENV = process.env.NEXT_PUBLIC_NOTIFICATION_ENV;
const APP_NAME = process.env.NEXT_PUBLIC_NOTIFICATION_APP_NAME;

const Notification = () => {
  const dispatch = useDispatch();
  const { data: signer, isError, isLoading } = useSigner();
  const credential = useSelector((state: RootState) => state.app.credential);

  const badge = useSelector((state: RootState) => state.notification);
  const authState = useSelector((state: RootState) => state.app.authStatus);

  const {
    epnsSDKSocket,
    isSDKSocketConnected,
    feedsSinceLastConnection,
    lastConnectionTimestamp,
  } = useSDKSocket({ account: credential.address, env: NOTIFICATION_ENV });

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getNoti = useCallback(async (address: string) => {
    const noti = await EpnsAPI.user.getFeeds({
      user: `eip155:42:${address}`,
      env: NOTIFICATION_ENV,
    });

    setNotifications(
      noti.filter(
        (item: any) => item?.app?.toLowerCase() === APP_NAME.toLowerCase()
      )
    );
  }, []);

  useEffect(() => {
    if (badge.count > 0 && credential.address) {
      getNoti(credential.address);
    }
  }, [badge, credential, getNoti]);

  useEffect(() => {
    const isSubscribeToNotificationChannel = async () => {
      let status = false;
      const subscriptions: any[] = await EpnsAPI.user.getSubscriptions({
        user: `eip155:42:${credential.address}`,
        env: NOTIFICATION_ENV,
      });

      subscriptions.forEach((sub: any) => {
        if (
          sub.channel.toLowerCase() === NOTIFICATION_CHANNEL_ADDR.toLowerCase()
        ) {
          status = true;
        }
      });

      return status;
    };

    const init = async () => {
      if (!(await isSubscribeToNotificationChannel())) {
        await EpnsAPI.channels.subscribe({
          // @ts-ignore
          signer: signer,
          channelAddress: `eip155:42:${NOTIFICATION_CHANNEL_ADDR}`,
          userAddress: `eip155:42:${credential.address}`,
          env: NOTIFICATION_ENV,
          onSuccess: () => {
            console.log("opt in success");
          },
          onError: (e) => {
            console.error("opt in error", e);
          },
        });
      }
      // @ts-ignore
      getNoti(credential.address);
    };
    credential.address ? init() : setNotifications([]);
  }, [credential, signer, getNoti]);

  const close = () => setIsOpen(false);

  const onToggle = () => {
    setIsOpen((old) => {
      if (!old) {
        dispatch(clear());
      }
      return !old;
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <NotificationButton onClick={onToggle} isOpen={isOpen}>
        <BellOutlined style={{ fontSize: 22, opacity: 1 }} color={"#00c3c1"} />
        {authState === "authenticated" && badge.count > 0 && (
          <span className="badge">{badge.count}</span>
        )}
      </NotificationButton>

      <NotificationBox
        isOpen={isOpen}
        isSmall={
          authState === "authenticated" ? notifications.length === 0 : true
        }
      >
        <div className="box">
          {(authState === "unauthenticated" ||
            (authState === "authenticated" && notifications.length === 0 )) && (
              <Result
                icon={<SmileOutlined style={{ color: "#19c9c7" }} />}
                title="No notifications!"
              />
            )}
          {authState === "authenticated" &&
            notifications.map((oneNotification, i) => {
              const {
                cta,
                title,
                message,
                app,
                icon,
                image,
                url,
                blockchain,
                notification,
              } = oneNotification;

              return (
                <Card
                  key={i}
                  title={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Logo iconSize={32} displayText={false} />
                      {title}
                    </span>
                  }
                  style={{ margin: "12px 0" }}
                  type="inner"
                >
                  <p style={{ wordBreak: "break-all" }}>{message}</p>
                </Card>
              );
            })}
        </div>
      </NotificationBox>

      <Backdrop isOpen={isOpen} onClick={close} />
    </div>
  );
};

export default Notification;

// {
//     "payload_id": 1973730,
//     "sender": "0xFF9FDbE7fe91067538Da54189B18963EE7A424B7",
//     "epoch": "2022-09-17T14:59:44.000Z",
//     "payload": {
//         "data": {
//             "app": "blockbookslab",
//             "sid": "419004",
//             "url": "google.com",
//             "acta": "",
//             "aimg": "",
//             "amsg": "sample msg body",
//             "asub": "Sat 17 Sep payload title",
//             "icon": "https://gateway.ipfs.io/ipfs/bafybeiee26fkqv3jad7ccq5pnzktvfg4coaajdbpoelzqjah7e7e7zjqxu/Qma9gbS3i9rURhTjxh471TQtnd3xL1bFyY3tXNdLhvcYBx",
//             "type": 3,
//             "epoch": "1663426783",
//             "etime": null,
//             "hidden": "0",
//             "sectype": null
//         },
//         "recipients": {
//             "0": null
//         },
//         "notification": {
//             "body": "[sdk-test] notification BODY",
//             "title": "blockbookslab - Sat 17 Sep notification TITLE:"
//         }
//     },
//     "source": "ETH_TEST_KOVAN"
// }

// {
//     "cta": "",
//     "title": "[sdk-test] payload title",
//     "message": "sample msg body",
//     "icon": "https://gateway.ipfs.io/ipfs/bafybeiee26fkqv3jad7ccq5pnzktvfg4coaajdbpoelzqjah7e7e7zjqxu/Qma9gbS3i9rURhTjxh471TQtnd3xL1bFyY3tXNdLhvcYBx",
//     "url": "google.com",
//     "sid": "216519",
//     "app": "blockbookslab",
//     "image": "",
//     "blockchain": "ETH_TEST_KOVAN",
//     "notification": {
//         "body": "[sdk-test] notification BODY",
//         "title": "blockbookslab - [SDK-TEST] notification TITLE:"
//     },
//     "secret": ""
// }
