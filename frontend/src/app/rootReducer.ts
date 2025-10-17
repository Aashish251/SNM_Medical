import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// API Slices
import { loginApi } from "@features/login/services/loginApi";
import { RegisterApi } from "@features/register/services";
import { api } from "@lib/api";

// Feature Reducers
import authReducer from "@features/login/redux/authSlice"

const rootReducer = combineReducers({
  [loginApi.reducerPath]: loginApi.reducer,
  [RegisterApi.reducerPath]: RegisterApi.reducer,
  [api.reducerPath]: api.reducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth slice
};

// Export persisted reducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);
