import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { persistedReducer } from "./rootReducer";
import { loginApi } from "@features/login/services/loginApi";
import { RegisterApi } from "@features/register/services";
import { AdminApi } from "@features/admin/dashboard/services/adminApi";
import { api } from "@lib/api";
import { MasterSearchApi } from "@features/admin/master-search/services/masterSearchApi";
import { CommonApi } from "@shared/services/commonApi";
import ForgotPasswordApi from "@features/forgot-password/service/ForgotPasswordApi";

export const store = configureStore({
  reducer: persistedReducer,
  // @ts-expect-error - RTK Query middleware compatibility with redux-persist
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    return middleware.concat(
      loginApi.middleware,
      RegisterApi.middleware,
      api.middleware,
      AdminApi.middleware,
      MasterSearchApi.middleware,
      CommonApi.middleware,
      ForgotPasswordApi.middleware
    );
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
