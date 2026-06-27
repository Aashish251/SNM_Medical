import { useAppSelector } from "@app/store/hooks";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";

export function Profile() {
  const { userDetails } = useAppSelector((state) => state.auth);
  const displayName = userDetails?.name ?? userDetails?.email?.split("@")[0] ?? "Admin";
  const email = userDetails?.email ?? "admin@snmmedical.com";

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            View your account details for the Medical Sewa Admin Portal.
          </p>
        </div>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>Administrator account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{displayName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">
                {userDetails?.userType ?? "admin"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
