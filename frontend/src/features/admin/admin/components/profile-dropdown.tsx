import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";
import { useAppSelector } from "@app/store/hooks";
import useDialogState from "@admin/hooks/use-dialog-state";
import { ROUTE_ADMIN_PROFILE } from "@admin/constants/routePaths";
import { getAvatarUrl } from "@admin/lib/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";
import { Button } from "@admin/components/ui/button";
import { useGetUserDetailsQueryQuery } from "@features/update-profile/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { SignOutDialog } from "@admin/components/sign-out-dialog";

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState();
  const { userDetails } = useAppSelector((state) => state.auth);
  const userId = userDetails?.id;

  const { data: profileResponse } = useGetUserDetailsQueryQuery(
    userId ? Number(userId) : 0,
    { skip: !userId }
  );

  const profile = profileResponse?.data;
  const displayName = profile?.fullName ?? userDetails?.name ?? "Admin";
  const email = profile?.email ?? userDetails?.email ?? "snm@gmail.com";
  const role = userDetails?.role ?? "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarSrc =
    getAvatarUrl(profile?.profileImage ?? userDetails?.profilePic) ??
    DEFAULT_PROFILE_IMAGE;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex h-auto min-w-0 max-w-[12rem] items-center gap-2.5 rounded-full p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 sm:max-w-[16rem]"
          >
            <Avatar className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 flex-col text-left sm:flex leading-tight">
              <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                {displayName}
              </span>
              <span className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {role}
              </span>
            </div>
            <ChevronDown className="hidden sm:block size-4 text-slate-400 dark:text-slate-500 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={ROUTE_ADMIN_PROFILE}>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="focus:bg-destructive/10 dark:focus:bg-destructive/20"
            onClick={() => setOpen(true)}
          >
            Sign out
            <DropdownMenuShortcut className="text-current">⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
