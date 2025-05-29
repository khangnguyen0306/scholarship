  import AuthReducer from "../src/slices/authSlice";
// import themeReducer from "../slices/themeSlice";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { authApi } from "../src/services/AuthAPI";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["user", "token", "avartar", "notiNumber"],
};

const AuthPerisReducer = persistReducer(persistConfig, AuthReducer);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: AuthPerisReducer,
    // theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
     
    ),
});

export const Persister = persistStore(store);