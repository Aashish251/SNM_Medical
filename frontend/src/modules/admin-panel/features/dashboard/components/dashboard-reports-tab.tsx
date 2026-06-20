import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Badge } from "@admin-panel/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin-panel/components/ui/card";
import {
  ADMIN_PANEL_DAILY_REPORT,
  ADMIN_PANEL_MASTER_REPORT,
  ADMIN_PANEL_REGISTRATION_REPORT,
} from "@admin-panel/constants/routePaths";
import { SectionHeader } from "./section-header";

const reports = [
  {
    id: "RPT-001",
    name: "Registration Summary",
    type: "Registration",
    date: "2026-06-13",
    status: "Generated",
    href: ADMIN_PANEL_REGISTRATION_REPORT,
  },
  {
    id: "RPT-002",
    name: "Daily OPD Report",
    type: "Daily",
    date: "2026-06-12",
    status: "Generated",
    href: ADMIN_PANEL_DAILY_REPORT,
  },
  {
    id: "RPT-003",
    name: "Monthly Master Report",
    type: "Master",
    date: "2026-06-01",
    status: "Pending",
    href: ADMIN_PANEL_MASTER_REPORT,
  },
  {
    id: "RPT-004",
    name: "Blood Donation Camp Report",
    type: "Camp",
    date: "2026-06-10",
    status: "Generated",
    href: ADMIN_PANEL_DAILY_REPORT,
  },
  {
    id: "RPT-005",
    name: "Health Checkup Summary",
    type: "Camp",
    date: "2026-06-08",
    status: "Generated",
    href: ADMIN_PANEL_DAILY_REPORT,
  },
];

const statusVariant: Record<string, string> = {
  Generated: "bg-teal-100/30 text-teal-900 border-teal-200",
  Pending: "bg-sky-200/40 text-sky-900 border-sky-300",
};

export function DashboardReportsTab() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consolidated Reports"
        description="Access and review generated operational reports."
      />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Latest reports across registration, daily, and master modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={report.href}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.id} · {report.type} · {report.date}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={statusVariant[report.status] ?? ""}
                >
                  {report.status}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
