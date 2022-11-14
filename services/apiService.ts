import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { TransactionHistory } from "../pages/app/transaction/Table";
import { IContact, ILabel, IWallet } from "../store/appSlice";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const instance = axios.create({
  // baseURL: ENDPOINT,
});

const successHandler = <T>(response: AxiosResponse<T>) => {
  return { success: true, data: response.data };
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

const serviceInstance = async <T>(
  method: string,
  url: string,
  config?: AxiosRequestConfig,
  data?: any
) => {
  switch (method) {
    case "POST":
      return instance
        .post<T>(url, data, config)
        .then(successHandler<T>)
        .catch(errorHandler);
    case "PUT":
      return instance
        .put<T>(url, data, config)
        .then(successHandler<T>)
        .catch(errorHandler);
    default:
      return instance
        .get<T>(url, config)
        .then(successHandler<T>)
        .catch(errorHandler);
  }
};

const service = {
  POST_FETCH_TRANSACTIONS: (userAddress: string) => {
    return serviceInstance("POST", `/transaction/1/${userAddress}`);
  },
  GET_FETCH_TRANSACTIONS_STATUS: (userAddress: string) => {
    return serviceInstance("GET", `/transaction/${userAddress}`);
  },
  GET_TRANSACTIONS: (options: { current: string; limit: string }) => {
    return serviceInstance<{
      txList: TransactionHistory[];
      pagination: { current: string; limit: string; totalItem: number };
    }>("GET", `/api/transactions`, {
      params: { current: options.current, limit: options.limit },
    });
  },
  GET_ACTION_BY_TX_HASH: (txHash: string) => {
    return serviceInstance("GET", `/action/${txHash}`);
  },
  PUT_ADD_LABEL_ON_TX: ({
    txHash,
    label,
  }: {
    txHash: string;
    label: string;
  }) => {
    return serviceInstance("PUT", `/label/${txHash}/${label}`);
  },
  GET_LABEL_BY_TX_HASH: (txHash: string) => {
    return serviceInstance("GET", `/label/${txHash}}`);
  },
  POST_ADD_CONTACT: ({ addr, name }: { addr: string; name: string }) => {
    return serviceInstance("POST", `/contact/${addr}/${name}`);
  },
  GET_CONTACT_BY_ADDR: (addr: string) => {
    return serviceInstance("POST", `/contact/${addr}`);
  },
  PUT_ADD_MEMO: ({ txHash, memo }: { txHash: string; memo: string | null }) => {
    return serviceInstance("PUT", `/memo/${txHash}/${memo}`);
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
    return serviceInstance<string>("GET", `/api/login/nonce`);
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
      `/api/login/verify`,
      {},
      { signature, message }
    );
  },
  POST_TX_DETAILS: ({
    txHash,
    memo,
    labels,
  }: {
    txHash: string;
    memo: string | null;
    labels: number[];
  }) => {
    return serviceInstance(
      "POST",
      `/api/transactions/details`,
      {},
      { txHash, memo, labels }
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
    labels,
  }: {
    txHash: string;
    labels: number[];
  }) => {
    return serviceInstance(
      "POST",
      `/api/transactions/details/labels`,
      {},
      { txHash, labels }
    );
  },
  POST_WALLET: ({
    userAddress,
    name,
  }: {
    userAddress: string;
    name: string;
  }) => {
    return serviceInstance(
      "POST",
      `/api/wallets`,
      {},
      {
        userAddress,
        name,
      }
    );
  },
  POST_CONTACT: ({
    userAddress,
    name,
  }: {
    userAddress: string;
    name: string;
  }) => {
    return serviceInstance(
      "POST",
      `/api/contacts`,
      {},
      {
        userAddress,
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
  GET_TX_RESULT: ({ address }: { address: string }) => {
    return serviceInstance<any>("GET", `/api/transactions/results/${address}`);
  },
};

Object.freeze(service);

export default service;
