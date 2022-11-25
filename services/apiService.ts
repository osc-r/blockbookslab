import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { TransactionHistory } from "../pages/transaction/Table";
import { IContact, ILabel, IWallet } from "../store/appSlice";

export const instance = axios.create({});

const successHandler = <T>(
  response: AxiosResponse<{ success: boolean; data: T }>
) => {
  return { success: true, data: response.data.data };
};

const errorHandler = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
  return { success: false, data: null };
};

type BaseResponse<T> = {
  success: boolean;
  data: T;
};

const serviceInstance = async <T>(
  method: string,
  url: string,
  config?: AxiosRequestConfig,
  data?: any
) => {
  switch (method) {
    case "POST":
      return instance
        .post<BaseResponse<T>>(url, data, config)
        .then(successHandler)
        .catch(errorHandler);
    case "PUT":
      return instance
        .put<BaseResponse<T>>(url, data, config)
        .then(successHandler)
        .catch(errorHandler);
    default:
      return instance
        .get<BaseResponse<T>>(url, config)
        .then(successHandler)
        .catch(errorHandler);
  }
};

const service = {
  GET_TRANSACTIONS: (options: { current: string; limit: string }) => {
    return serviceInstance<{
      txList: TransactionHistory[];
      pagination: { current: string; limit: string; totalItem: number };
    }>("GET", `/api/transactions`, {
      params: { current: options.current, limit: options.limit },
    });
  },
  GET_LABELS: () => {
    return serviceInstance<ILabel[]>("GET", `/api/labels`);
  },
  GET_CONTACTS: () => {
    return serviceInstance<IContact[]>("GET", `/api/contacts`);
  },
  GET_WALLETS: () => {
    return serviceInstance<IWallet[]>("GET", `/api/wallets`);
  },
  GET_NONCE: () => {
    return serviceInstance<string>("GET", `/api/auth/nonce`);
  },
  POST_VERIFY: ({
    signature,
    message,
  }: {
    signature: string;
    message: string;
  }) => {
    return serviceInstance<any>(
      "POST",
      `/api/auth/verify`,
      {},
      { signature, message }
    );
  },
  POST_TX_DETAILS: ({
    txHash,
    memo,
    txLabels,
  }: {
    txHash: string;
    memo: string | null;
    txLabels: number[];
  }) => {
    return serviceInstance(
      "POST",
      `/api/transactions/details`,
      {},
      { txHash, memo, txLabels }
    );
  },
  POST_TX_MEMO: ({ txHash, memo }: { txHash: string; memo: string | null }) => {
    return serviceInstance(
      "POST",
      `/api/transactions/details/memo`,
      {},
      { txHash, memo }
    );
  },
  POST_TX_LABELS: ({
    txHash,
    txLabels,
  }: {
    txHash: string;
    txLabels: number[];
  }) => {
    return serviceInstance(
      "POST",
      `/api/transactions/details/labels`,
      {},
      { txHash, txLabels }
    );
  },
  POST_WALLET: ({ address, name }: { address: string; name: string }) => {
    return serviceInstance<{ isSynced: boolean }>(
      "POST",
      `/api/wallets`,
      {},
      {
        address,
        name,
        chain_id: "1",
      }
    );
  },
  POST_CONTACT: ({ address, name }: { address: string; name: string }) => {
    return serviceInstance(
      "POST",
      `/api/contacts`,
      {},
      {
        address,
        name,
      }
    );
  },
  GET_CSV: () => {
    return serviceInstance<any>("GET", `/api/csv`, {
      headers: {
        "Content-Type": "text/csv",
      },
      responseType: "blob",
    });
  },
  POST_LABEL: ({ name }: { name: string }) => {
    return serviceInstance(
      "POST",
      `/api/labels`,
      {},
      {
        name,
      }
    );
  },
};

Object.freeze(service);

export default service;
