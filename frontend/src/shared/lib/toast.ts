import { toast as hotToast } from "react-hot-toast";

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    hotToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }),
};
