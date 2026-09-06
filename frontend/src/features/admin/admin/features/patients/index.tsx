import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { useAdminTableSearch } from "@admin/hooks/use-admin-table-search";
import { PatientsDialogs } from "./components/patients-dialogs";
import { PatientsPrimaryButtons } from "./components/patients-primary-buttons";
import { PatientsProvider } from "./components/patients-provider";
import { PatientsTable } from "./components/patients-table";
import { patients } from "./data/patients";

export function Patients() {
  const { search, navigate } = useAdminTableSearch();

  return (
    <PatientsProvider>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Patient List</h2>
            <p className="text-muted-foreground">
              Manage your registered patients and their medical records here.
            </p>
          </div>
          <PatientsPrimaryButtons />
        </div>
        <PatientsTable data={patients} search={search} navigate={navigate} />
      </Main>

      <PatientsDialogs />
    </PatientsProvider>
  );
}
