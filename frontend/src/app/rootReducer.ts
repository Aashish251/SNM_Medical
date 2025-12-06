import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { loginApi } from "@features/login/services/loginApi";
import { RegisterApi } from "@features/register/services";
import { AdminApi } from "@features/admin/dashboard/services/adminApi";
import authReducer from "@features/login/redux/authSlice";
import { CommonApi } from "@shared/services/commonApi";
import { MasterSearchApi } from "@features/admin/master-search/services/masterSearchApi";
import ForgotPasswordApi from "@features/forgot-password/service/ForgotPasswordApi";
import { UpdateProfileApi } from "@features/update-profile/services";

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [RegisterApi.reducerPath]: RegisterApi.reducer,
  [UpdateProfileApi.reducerPath]: UpdateProfileApi.reducer,
  [AdminApi.reducerPath]: AdminApi.reducer,
  [MasterSearchApi.reducerPath]: MasterSearchApi.reducer,
  [CommonApi.reducerPath]: CommonApi.reducer,
  [ForgotPasswordApi.reducerPath]: ForgotPasswordApi.reducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth slice
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
