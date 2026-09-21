import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@app/store/hooks";
import { signOut } from "@entities/session/model/authSlice";
import { SNM_NAV_LOGIN_LINK } from "@shared/constants";
import { ConfirmDialog } from "@admin/components/confirm-dialog";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
    navigate(SNM_NAV_LOGIN_LINK, { replace: true });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
