import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationStatus } from "@rainbow-me/rainbowkit";

export interface IWallet {
  name: null | string;
  address: string;
}

export interface ILabel {
  id: number;
  label: string;
}

export interface IContact {}

export interface AppState {
  wallet: {
    [key: string]: { address: string; isFetchBatch: boolean; name?: string }[];
  };
  contacts: IContact[];
  wallets: IWallet[];
  labels: ILabel[];
  authStatus: AuthenticationStatus;
}

const initialState: AppState = {
  wallet: {},
  contacts: [],
  wallets: [],
  labels: [],
  authStatus: "unauthenticated",
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
} = appSlice.actions;

export default appSlice.reducer;
