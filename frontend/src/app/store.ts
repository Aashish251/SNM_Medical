import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { persistedReducer } from "./rootReducer";
import { loginApi } from "@features/login/services/loginApi";
import { RegisterApi } from "@features/register/services";
import { api } from "@lib/api";

export const store = configureStore({
  reducer: persistedReducer,
  // @ts-expect-error - RTK Query middleware compatibility with redux-persist
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    return middleware.concat(loginApi.middleware, RegisterApi.middleware, api.middleware);
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;