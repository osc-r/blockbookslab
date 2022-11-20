import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

export interface IWallet {
  name: null | string;
  address: string;
}

export interface ILabel {
  name: string;
  id: string;
}

export interface IContact {
  address: string;
  id: string;
  name: string;
}

interface ICredential {
  address: string | null;
  loginMethod: "SIWE" | "UD" | null;
  name: string | null;
  jwt: string | null;
}
export interface AppState {
  contacts: IContact[];
  wallets: IWallet[];
  labels: ILabel[];
  authStatus: AuthenticationStatus;
  credential: ICredential;
  refreshTransaction: boolean;
}

const initialState: AppState = {
  contacts: [],
  wallets: [],
  labels: [],
  authStatus: "unauthenticated",

  credential: {
    address: null,
    loginMethod: null,
    name: null,
    jwt: null,
  },

  refreshTransaction: false,
};

export const appSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<IWallet[]>) => {
      state.wallets = action.payload;
    },
    setLabels: (state, action: PayloadAction<ILabel[]>) => {
      state.labels = action.payload;
    },
    setContacts: (state, action: PayloadAction<IContact[]>) => {
      state.contacts = action.payload;
    },

    setAuthLoading: (state) => {
      state.authStatus = "loading";
    },
    setAuthenticated: (state) => {
      state.authStatus = "authenticated";
    },
    setUnauthenticated: (state) => {
      state.authStatus = "unauthenticated";
    },

    setCredential: (state, action: PayloadAction<{ data: ICredential }>) => {
      state.credential = action.payload.data;
    },
    logout: (state) => {
      state.credential = initialState.credential;
      state.contacts = initialState.contacts;
      state.wallets = initialState.wallets;
      state.labels = initialState.labels;
      state.authStatus = initialState.authStatus;
    },

    setRefreshTx: (state) => {
      state.refreshTransaction = !state.refreshTransaction;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWallets,
  setLabels,
  setContacts,
  setAuthLoading,
  setAuthenticated,
  setUnauthenticated,
  setCredential,
  logout,
  setRefreshTx,
} = appSlice.actions;

export default appSlice.reducer;
