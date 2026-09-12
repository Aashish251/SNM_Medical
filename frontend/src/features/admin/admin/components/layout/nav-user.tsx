import { LogOut } from "lucide-react";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";
import { useAppSelector } from "@app/store/hooks";
import useDialogState from "@admin/hooks/use-dialog-state";
import { getAvatarUrl } from "@admin/lib/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@admin/components/ui/sidebar";
import { SignOutDialog } from "@admin/components/sign-out-dialog";
import { useGetUserDetailsQueryQuery } from "@features/update-profile/services";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function NavUser({ user }: NavUserProps) {
  const [open, setOpen] = useDialogState();
  const { userDetails } = useAppSelector((state) => state.auth);
  const userId = userDetails?.id;

  const { data: profileResponse } = useGetUserDetailsQueryQuery(
    userId ? Number(userId) : 0,
    { skip: !userId }
  );

  const profile = profileResponse?.data;
  const displayName = profile?.fullName ?? userDetails?.name ?? user.name;
  const email = profile?.email ?? userDetails?.email ?? user.email;
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarSrc =
    getAvatarUrl(profile?.profileImage ?? userDetails?.profilePic) ??
    DEFAULT_PROFILE_IMAGE;

  return (
    <>
      <SidebarMenu>
        {/* User Info Row */}
        <SidebarMenuItem>
          <div className="flex min-w-0 items-center gap-2.5 px-2 py-1.5">
            <Avatar className="h-8 w-8 shrink-0 rounded-lg border border-white/20">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="rounded-lg bg-white/15 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground">
                {displayName}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {email}
              </span>
            </div>
          </div>
        </SidebarMenuItem>

        {/* Standalone Logout Button */}
        <SidebarMenuItem>
          <SidebarMenuButton
            size="sm"
            className="text-sidebar-foreground/80 hover:bg-white/10 hover:text-white gap-2"
            onClick={() => setOpen(true)}
          >
            <LogOut className="size-4" />
            <span className="text-sm font-medium">Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}

