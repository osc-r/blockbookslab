import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  wallet: {
    [key: string]: { address: string; isFetchBatch: boolean; name?: string }[];
  };
  contact: {
    [key: string]: { address: string; name: string }[];
  };
}

const initialState: AppState = {
  wallet: {},
  contact: {},
};

export const appSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    newAccount: (state, action: PayloadAction<string>) => {
      const payload = action.payload.toLowerCase();

      if (state.wallet[payload]) {
        if (
          !state.wallet[payload].find(
            (item) => item.address.toLowerCase() === payload
          )
        ) {
          state.wallet[payload].push({
            address: payload,
            isFetchBatch: false,
          });
        }
      } else {
        state.wallet[payload] = [{ address: payload, isFetchBatch: false }];
      }
    },
    addWallet: (
      state,
      action: PayloadAction<{ account: string; addr: string; name: string }>
    ) => {
      const index = state.wallet[
        action.payload.account.toLowerCase()
      ].findIndex(
        (item) =>
          item.address.toLowerCase() === action.payload.addr.toLowerCase()
      );
      if (index < 0) {
        state.wallet[action.payload.account.toLowerCase()].push({
          address: action.payload.addr.toLowerCase(),
          isFetchBatch: false,
          name: action.payload.name,
        });
      }
    },
    updateWalletIsFetchBatch: (
      state,
      action: PayloadAction<{ account: string; addr: string }>
    ) => {
      state.wallet[action.payload.account.toLowerCase()].forEach((item, i) => {
        if (item.address === action.payload.addr.toLowerCase()) {
          state.wallet[action.payload.account.toLowerCase()][i].isFetchBatch =
            true;
        }
      });
    },
    addContact: (
      state,
      action: PayloadAction<{ account: string; addr: string; name: string }>
    ) => {
      const account = action.payload.account.toLowerCase();
      const contact = {
        address: action.payload.addr,
        name: action.payload.name,
      };

      if (state.contact[account]) {
        const index = state.contact[account].findIndex(
          (i) => i.address.toLowerCase() === contact.address.toLowerCase()
        );
        if (index >= 0) {
          state.contact[account][index] = contact;
        } else {
          state.contact[account].push(contact);
        }
      } else {
        state.contact[account] = [contact];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { newAccount, updateWalletIsFetchBatch, addWallet, addContact } =
  appSlice.actions;

export default appSlice.reducer;
