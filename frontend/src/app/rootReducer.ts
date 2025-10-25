import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { loginApi } from "@features/login/services/loginApi";
import { RegisterApi } from "@features/register/services";
import { api } from "@lib/api";
import { AdminApi } from "@features/admin/dashboard/services/adminApi";
import authReducer from "@features/login/redux/authSlice";

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [RegisterApi.reducerPath]: RegisterApi.reducer,
  [api.reducerPath]: api.reducer,
  [AdminApi.reducerPath]: AdminApi.reducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth slice
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
