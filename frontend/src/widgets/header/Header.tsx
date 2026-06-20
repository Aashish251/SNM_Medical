import { useHeaderNavigation } from "./hooks/useHeaderNavigation";
import { HeaderShell } from "./ui/HeaderShell";
import { MobileDrawer } from "./ui/MobileDrawer";

export default function Header() {
  const {
    scrolled,
    openDropdown,
    drawerOpen,
    setDrawerOpen,
    activeMenu,
    isAuthenticated,
    authUserType,
    loggedInUserDetails,
    filteredNavLinks,
    filteredDashboardNav,
    toggleDropdown,
    handleLogout,
  } = useHeaderNavigation();

  return (
    <>
      <HeaderShell
        scrolled={scrolled}
        activeMenu={activeMenu}
        isAuthenticated={isAuthenticated}
        authUserType={authUserType}
        userName={loggedInUserDetails?.name}
        profilePic={loggedInUserDetails?.profilePic}
        userId={loggedInUserDetails?.id}
        dashboardNav={filteredDashboardNav}
        onLogout={handleLogout}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <MobileDrawer
        isOpen={drawerOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => setDrawerOpen(false)}
        handleLogout={handleLogout}
        navLinks={filteredNavLinks}
        userName={loggedInUserDetails?.name}
        openDropdown={openDropdown}
        loggedInUserDetailsId={loggedInUserDetails?.id}
        authUserType={authUserType}
        toggleDropdown={toggleDropdown}
      />
    </>
  );
}
