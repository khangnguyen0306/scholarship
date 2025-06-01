import AuthReducer from "../src/slices/authSlice";
// import themeReducer from "../slices/themeSlice";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { baseApi } from "../src/services/BaseAPI";
import { authApi } from "../src/services/AuthAPI";
import { uploadApi } from "../src/services/UploadAPI";
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
    [authApi.reducerPath]: authApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    auth: AuthPerisReducer,

    // theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware).concat(authApi.middleware).concat(uploadApi.middleware),
});

export const Persister = persistStore(store);