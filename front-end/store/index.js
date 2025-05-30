import AuthReducer from "../src/slices/authSlice";
// import themeReducer from "../slices/themeSlice";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { baseApi } from "../src/services/BaseAPI";
// Không cần import SchoolAPI và ScholarshipAPI nữa

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["user", "token", "avartar", "notiNumber"],
};

const AuthPerisReducer = persistReducer(persistConfig, AuthReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: AuthPerisReducer,
    // theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

export const Persister = persistStore(store);