import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";
import { handleNavigate } from "@shared/config/common";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar";
import type { ProfileDropdownProps } from "../model/types";

type HeaderProfileDropdownProps = ProfileDropdownProps & {
  userName?: string;
  profilePic?: string;
};

export function HeaderProfileDropdown({
  dashboardNav,
  authUserType,
  userId,
  userName,
  profilePic,
  onLogout,
}: HeaderProfileDropdownProps) {
  const navigate = useNavigate();

  return (
    <>
      <span className="py-2 text-white font-semibold transition capitalize">
        {userName && `Welcome ${userName} Ji`}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="w-10 h-10 ring-2 ring-white cursor-pointer">
              <AvatarImage
                src={
                  profilePic
                    ? `${import.meta.env.VITE_API_BASE_URL}${profilePic}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt="User Avatar"
              />
              <AvatarFallback>
                {userName?.[0]?.toUpperCase() || "U"}+"hgghc"
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48 mt-2 bg-to-bottom-theme-gradient text-white shadow-lg rounded-md font-semibold transition">
          {dashboardNav.map((link) => {
            if (link.children && link.children.length > 0) {
              return (
                <DropdownMenuSub key={link.text}>
                  <DropdownMenuSubTrigger className="hover:text-black data-[state=open]:bg-white data-[state=open]:text-black">
                    {link.text}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-48 mt-2 bg-to-bottom-theme-gradient text-white shadow-lg rounded-md font-semibold transition">
                      {link.children.map((child) => (
                        <DropdownMenuItem
                          key={child.href}
                          onClick={() => navigate(child.href ?? "")}
                        >
                          {child.text}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            }

            return (
              <DropdownMenuItem
                key={link.href}
                onClick={() =>
                  navigate(
                    handleNavigate(link.href ?? "", authUserType, userId ? String(userId) : ""),
                    { state: { userId } }
                  )
                }
              >
                {link.text}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
