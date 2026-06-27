import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTE_ADMIN_BASE } from "@admin/constants/routePaths";
import { cn } from "@admin/lib/utils";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  "registration-report": "Registration Report",
  "daily-report": "Daily Report",
  "duty-chart": "Duty Chart",
  "master-search": "Master Search",
  "master-report": "Master Report",
  master: "Master",
  city: "City",
  state: "State",
  qualification: "Qualification",
  department: "Department",
  availability: "Availability",
  "shift-time": "Shift Time",
  "free-health-checkup": "Free Health Checkup",
  "blood-donation": "Blood Donation",
  profile: "Profile",
};

export function AdminBreadcrumbs() {
  const { pathname } = useLocation();

  if (!pathname.startsWith(ROUTE_ADMIN_BASE)) return null;

  const segments = pathname
    .replace(ROUTE_ADMIN_BASE, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `${ROUTE_ADMIN_BASE}/${segments.slice(0, index + 1).join("/")}`;
    return {
      href,
      label: LABELS[segment] ?? segment,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link to={ROUTE_ADMIN_BASE + "/dashboard"} className="hover:text-primary">
            Admin
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            {crumb.isLast ? (
              <span className={cn("font-medium text-primary")}>{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="hover:text-primary">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
