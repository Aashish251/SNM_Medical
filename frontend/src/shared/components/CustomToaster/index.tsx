import toast, { Toaster, ToastBar } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster position="top-right" toastOptions={{ duration: 5000 }}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {icon}
              <span style={{ flex: 1 }}>{message}</span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
                onClick={() => toast.dismiss(t.id)}
              >
                &#x2715;
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
