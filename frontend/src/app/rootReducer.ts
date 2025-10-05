import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { loginApi } from "@features/login/services/loginApi";
import authReducer from "@features/login/redux/authSlice";

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

