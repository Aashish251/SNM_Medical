import { Header } from "@admin-panel/components/layout/header";
import { Main } from "@admin-panel/components/layout/main";
import { ProfileDropdown } from "@admin-panel/components/profile-dropdown";
import { Search } from "@admin-panel/components/search";
import { ThemeSwitch } from "@admin-panel/components/theme-switch";
import { useAdminTableSearch } from "@admin-panel/hooks/use-admin-table-search";
import { EntityListDialogs } from "./entity-list-dialogs";
import { EntityListPrimaryButtons } from "./entity-list-primary-buttons";
import { EntityListProvider } from "./entity-list-provider";
import { EntityListTable } from "./entity-list-table";
import type { EntityListModuleConfig } from "./types";

type EntityListPageProps<T extends { id: string }> = {
  config: EntityListModuleConfig<T>;
};

export function EntityListPage<T extends { id: string }>({
  config,
}: EntityListPageProps<T>) {
  const { search, navigate } = useAdminTableSearch();

  return (
    <EntityListProvider
      handlers={{
        onPublishToggle: config.onPublishToggle,
      }}
    >
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
          <EntityListPrimaryButtons config={config} />
        </div>
        <EntityListTable config={config} search={search} navigate={navigate} />
      </Main>

      <EntityListDialogs config={config} />
    </EntityListProvider>
  );
}
