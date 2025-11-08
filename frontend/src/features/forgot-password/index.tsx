import React, { useState } from "react";
import SecurityForm from "./components/SecurityForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { UserRegIdObj } from "./type";



const ForgetPassword: React.FC = () => {
  const [formStage, setFormStage] = useState<"security" | "reset">("security");
  const [userRegIdObj, setUserRegIDObj] = useState<UserRegIdObj>({});

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-200/20 to-yellow-200/10 flex flex-col py-8">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200/20 to-yellow-200/10 animate-pulse" />
        <div className="absolute animate-ping bg-pink-300/30 w-20 h-20 rounded-full bottom-10 left-10" />
      </div>

      <div className="bg-[#f9f9f6] flex flex-col min-h-screen overflow-hidden relative z-10">
        <div className="pt-24 flex-1 flex items-center justify-center w-full px-2 sm:px-6">
          {formStage === "security" ? (
            <SecurityForm
              onSuccess={() => setFormStage("reset")}
              setUserRegIDObj={setUserRegIDObj}
            />
          ) : (
            <ResetPasswordForm
              onReset={() => setFormStage("security")}
              userRegIdObj={userRegIdObj}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
