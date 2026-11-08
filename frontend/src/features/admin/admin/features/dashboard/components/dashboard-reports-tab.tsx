import { Link } from "react-router-dom";
import { FileText, ArrowUpRight, Download, Calendar } from "lucide-react";
import { Badge } from "@admin/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import {
  ROUTE_ADMIN_DAILY_REPORT,
  ROUTE_ADMIN_MASTER_REPORT,
  ROUTE_ADMIN_REGISTRATION_REPORT,
} from "@admin/constants/routePaths";
import { SectionHeader } from "./section-header";

const reports = [
  {
    id: "RPT-001",
    name: "Registration Summary Report",
    type: "Registration",
    date: "2026-06-13",
    status: "Generated",
    href: ROUTE_ADMIN_REGISTRATION_REPORT,
    size: "1.2 MB",
  },
  {
    id: "RPT-002",
    name: "Daily OPD Consultation Report",
    type: "Daily",
    date: "2026-06-12",
    status: "Generated",
    href: ROUTE_ADMIN_DAILY_REPORT,
    size: "840 KB",
  },
  {
    id: "RPT-003",
    name: "Monthly Medical Master Report",
    type: "Master",
    date: "2026-06-01",
    status: "Pending",
    href: ROUTE_ADMIN_MASTER_REPORT,
    size: "Processing",
  },
  {
    id: "RPT-004",
    name: "Blood Donation Camp Metrics",
    type: "Camp",
    date: "2026-06-10",
    status: "Generated",
    href: ROUTE_ADMIN_DAILY_REPORT,
    size: "620 KB",
  },
  {
    id: "RPT-005",
    name: "Community Health Outreach Audit",
    type: "Camp",
    date: "2026-06-08",
    status: "Generated",
    href: ROUTE_ADMIN_DAILY_REPORT,
    size: "1.5 MB",
  },
];

export function DashboardReportsTab() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consolidated Reports"
        description="Access, download, and review generated operational reports across medical units."
      />
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold sm:text-lg">Recent Reports</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Latest operational summaries across registration, OPD daily logs, and master modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={report.href}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-sm dark:border-slate-800 dark:hover:bg-slate-900/60"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-105 dark:bg-blue-950/50 dark:text-blue-300">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {report.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{report.id}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {report.date}
                      </span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      report.status === "Generated"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                    }
                  >
                    {report.status}
                  </Badge>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
