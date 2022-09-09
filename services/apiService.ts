import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
});

const successHandler = (response: AxiosResponse) => {
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

const serviceInstance = async (
  method: string,
  url: string,
  config?: AxiosRequestConfig,
  data?: any
) => {
  switch (method) {
    case "POST":
      return instance
        .post(url, data, config)
        .then(successHandler)
        .catch(errorHandler);
    case "PUT":
      return instance
        .put(url, data, config)
        .then(successHandler)
        .catch(errorHandler);
    default:
      return instance.get(url, config).then(successHandler).catch(errorHandler);
  }
};

const service = {
  POST_FETCH_TRANSACTIONS: (userAddress: string) => {
    return serviceInstance("POST", `/wallet/${userAddress}`);
  },
  GET_FETCH_TRANSACTIONS_STATUS: (userAddress: string) => {
    return serviceInstance("GET", `/wallet/${userAddress}`);
  },
  GET_TRANSACTIONS: (userAddress: string) => {
    return serviceInstance("GET", `/transactions/${userAddress}`);
  },
  GET_ACTION_BY_TX_HASH: (txHash: string) => {
    return serviceInstance("GET", `/action/${txHash}`);
  },
  POST_ADD_LABEL_ON_TX: ({
    txHash,
    label,
  }: {
    txHash: string;
    label: string;
  }) => {
    return serviceInstance("POST", `/label/${txHash}/${label}`);
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
};

Object.freeze(service);

export default service;
