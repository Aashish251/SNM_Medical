import { Link } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import useDialogState from "@admin-panel/hooks/use-dialog-state";
import { ADMIN_PANEL_PROFILE } from "@admin-panel/constants/routePaths";
import { Avatar, AvatarFallback, AvatarImage } from "@admin-panel/components/ui/avatar";
import { Button } from "@admin-panel/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@admin-panel/components/ui/dropdown-menu";
import { SignOutDialog } from "@admin-panel/components/sign-out-dialog";

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState();
  const { userDetails } = useAppSelector((state) => state.auth);

  const displayName = userDetails?.name ?? userDetails?.email?.split("@")[0] ?? "Admin";
  const email = userDetails?.email ?? "admin@snmmedical.com";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userDetails?.profilePic} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
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
              <Link to={ADMIN_PANEL_PROFILE}>
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
