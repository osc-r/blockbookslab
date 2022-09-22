import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import appReducer from "./appSlice";
import notificationReducer from "./notificationSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  app: appReducer,
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
