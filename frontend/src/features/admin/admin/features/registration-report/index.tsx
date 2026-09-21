import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  RotateCcw,
  Search,
  Users,
  Building2,
  Award,
  Calendar,
  BarChart3,
  Table as TableIcon,
  ListFilter,
  CheckCircle2,
} from "lucide-react";
import {
  useGetReportMetadataQuery,
  useGetRegistrationReportQuery,
  type RegistrationReportRow,
} from "../../services/reportsApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Badge } from "@admin/components/ui/badge";
import { Switch } from "@admin/components/ui/switch";
import { Label } from "@admin/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@admin/components/ui/tabs";
import { Skeleton } from "@admin/components/ui/skeleton";
import { exportToCsv, triggerPrint } from "../reports-common/reportExportUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4",
  "#ec4899", "#f97316", "#6366f1", "#14b8a6", "#84cc16",
];

export function RegistrationReport() {
  const { data: metaResponse, isLoading: isMetaLoading } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  // Default to the first date with maximum records if available, otherwise empty
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [customDate, setCustomDate] = useState("");
  const [includeEmpty, setIncludeEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("table");

  // Effective query dates
  const queryDates = useMemo(() => {
    if (selectedDates.length > 0) return selectedDates.join(",");
    // If no dates selected yet and available dates loaded, pick latest with data
    if (availableDates.length > 0) {
      // Find date with highest count or latest
      const best = availableDates.find((d) => d.count > 10) || availableDates[0];
      return best.date;
    }
    return "";
  }, [selectedDates, availableDates]);

  const {
    data: reportResponse,
    isLoading: isReportLoading,
    isFetching,
    refetch,
  } = useGetRegistrationReportQuery(
    {
      dates: queryDates,
      includeEmpty,
      includeRecords: true,
    },
    { skip: isMetaLoading && availableDates.length === 0 }
  );

  const reportData = reportResponse?.data;
  const rows: RegistrationReportRow[] = reportData?.rows || [];
  const columns = reportData?.columns || [];
  const totals = reportData?.totals || { byDate: {}, grandTotal: 0 };
  const records = reportData?.records || [];

  // Active dates array for UI pills
  const activeDates = reportData?.dates || (queryDates ? queryDates.split(",") : []);

  // Filter rows by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((r) => r.department.toLowerCase().includes(term));
  }, [rows, searchTerm]);

  // Derived KPI metrics
  const kpis = useMemo(() => {
    const totalRegistrations = totals.grandTotal || 0;
    const activeDepartments = rows.filter((r) => r.total > 0).length;
    const topDept = [...rows].sort((a, b) => b.total - a.total)[0];
    const topDeptName = topDept && topDept.total > 0 ? topDept.department : "None";
    const topDeptCount = topDept?.total || 0;

    return {
      totalRegistrations,
      activeDepartments,
      topDeptName,
      topDeptCount,
      datesCount: activeDates.length,
    };
  }, [rows, totals, activeDates]);

  // Top departments chart data
  const chartData = useMemo(() => {
    return rows
      .filter((r) => r.total > 0)
      .slice(0, 10)
      .map((r, i) => ({
        name: r.department.length > 18 ? `${r.department.slice(0, 16)}...` : r.department,
        fullName: r.department,
        count: r.total,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      }));
  }, [rows]);

  // Handle toggling date pill
  const handleToggleDate = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      const next = selectedDates.filter((d) => d !== dateStr);
      setSelectedDates(next);
    } else {
      // Keep up to 3 dates
      const next = [...selectedDates, dateStr].slice(-3);
      setSelectedDates(next);
    }
  };

  const handleAddCustomDate = () => {
    if (!customDate) return;
    if (!selectedDates.includes(customDate)) {
      setSelectedDates([...selectedDates, customDate].slice(-3));
    }
    setCustomDate("");
  };

  // Export handlers
  const handleExportCsv = () => {
    if (!reportData) return;
    const headers = [
      "Department",
      ...columns.map((c) => c.label),
      "Total Registrations",
      "Share (%)",
    ];

    const exportRows = rows.map((r) => {
      const share =
        totals.grandTotal > 0
          ? ((r.total / totals.grandTotal) * 100).toFixed(1) + "%"
          : "0%";
      return [
        r.department,
        ...columns.map((c) => r.values[c.key] || 0),
        r.total,
        share,
      ];
    });

    // Add total row
    exportRows.push([
      "GRAND TOTAL",
      ...columns.map((c) => totals.byDate[c.key] || 0),
      totals.grandTotal,
      "100%",
    ]);

    exportToCsv(`registration_report_${activeDates.join("_")}`, headers, exportRows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Registration Report
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              Live Database
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Department-wise registration volume, multi-date attendance trends, and clinical audit records.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
          >
            <RotateCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={triggerPrint}
            className="h-9 gap-1.5"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button
            size="sm"
            onClick={handleExportCsv}
            disabled={!reportData || rows.length === 0}
            className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Filter & Control Bar */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Quick Pick Date Pills */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" />
                <span>Select Report Dates (Up to 3):</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {availableDates.slice(0, 6).map((item) => {
                  const isSelected = activeDates.includes(item.date);
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => handleToggleDate(item.date)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3" />}
                      <span>{item.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground"
                        }`}
                      >
                        {item.count.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Date Input */}
            <div className="flex items-center gap-2 shrink-0">
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="h-9 w-40 text-xs"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddCustomDate}
                disabled={!customDate}
                className="h-9 text-xs"
              >
                Add Date
              </Button>
            </div>
          </div>

          <div className="border-t pt-3 flex flex-wrap items-center justify-between gap-3">
            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            {/* Toggle empty departments */}
            <div className="flex items-center gap-2">
              <Switch
                id="includeEmptyReg"
                checked={includeEmpty}
                onCheckedChange={setIncludeEmpty}
              />
              <Label htmlFor="includeEmptyReg" className="text-xs font-medium cursor-pointer">
                Include zero-registration departments
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Registrations
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.totalRegistrations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {kpis.datesCount} selected date{kpis.datesCount > 1 ? "s" : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Departments
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.activeDepartments}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Departments with recorded staff
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Top Department
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-xl font-bold text-foreground truncate" title={kpis.topDeptName}>
                  {kpis.topDeptName}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.topDeptCount.toLocaleString()} registrations (
                  {kpis.totalRegistrations > 0
                    ? ((kpis.topDeptCount / kpis.totalRegistrations) * 100).toFixed(1)
                    : 0}
                  %)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average Per Dept
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.activeDepartments > 0
                    ? Math.round(kpis.totalRegistrations / kpis.activeDepartments).toLocaleString()
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average volume per active unit
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="table" className="gap-1.5 text-xs">
              <TableIcon className="h-3.5 w-3.5" />
              Department Summary Table
            </TabsTrigger>
            <TabsTrigger value="chart" className="gap-1.5 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              Volume Analytics
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-1.5 text-xs">
              <ListFilter className="h-3.5 w-3.5" />
              Registration Records ({records.length})
            </TabsTrigger>
          </TabsList>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Showing {filteredRows.length} department entries
          </div>
        </div>

        {/* Tab 1: Department Matrix Table */}
        <TabsContent value="table" className="space-y-4">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="py-3 px-4 font-semibold text-muted-foreground w-12 text-center">#</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground min-w-[200px]">Department</th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[110px]"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[110px]">
                      Total Registrations
                    </th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-right min-w-[120px]">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isReportLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3 px-4 text-center"><Skeleton className="h-4 w-4 mx-auto" /></td>
                        <td className="py-3 px-4"><Skeleton className="h-4 w-36" /></td>
                        {columns.map((col) => (
                          <td key={col.key} className="py-3 px-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                        ))}
                        <td className="py-3 px-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                        <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 4}
                        className="py-12 text-center text-muted-foreground"
                      >
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="font-medium">No registrations found for the selected dates.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try choosing another date above or toggling &quot;Include zero-registration departments&quot;.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, index) => {
                      const sharePct =
                        totals.grandTotal > 0
                          ? ((row.total / totals.grandTotal) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <tr
                          key={row.departmentId || row.department}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-2.5 px-4 text-center text-muted-foreground font-mono">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-foreground">
                            {row.department}
                          </td>
                          {columns.map((col) => {
                            const val = row.values[col.key] || 0;
                            return (
                              <td
                                key={col.key}
                                className={`py-2.5 px-4 text-center font-mono ${
                                  val > 0 ? "font-semibold text-foreground" : "text-muted-foreground/50"
                                }`}
                              >
                                {val > 0 ? val.toLocaleString() : "-"}
                              </td>
                            );
                          })}
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-foreground">
                            {row.total.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-mono text-xs text-muted-foreground w-12 text-right">
                                {sharePct}%
                              </span>
                              <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${Math.min(100, Number(sharePct) * 2)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {filteredRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-primary/5 border-t-2 border-primary/20 font-bold text-foreground">
                      <td className="py-3 px-4 text-center font-mono">Σ</td>
                      <td className="py-3 px-4 uppercase tracking-wider text-xs">Grand Total</td>
                      {columns.map((col) => (
                        <td key={col.key} className="py-3 px-4 text-center font-mono text-primary text-sm">
                          {(totals.byDate[col.key] || 0).toLocaleString()}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center font-mono text-primary text-base">
                        {totals.grandTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">100%</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Analytics Chart */}
        <TabsContent value="chart" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Top 10 Departments by Registration Volume</CardTitle>
              <CardDescription>
                Comparison of patient/staff registration workload across major departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No data to display in chart for selected dates.
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={130}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(val: any) => [`${Number(val).toLocaleString()} registrations`, "Count"]}
                        labelFormatter={(label: any, payload: any) => {
                          const item = payload?.[0]?.payload;
                          return item?.fullName || label;
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Detailed Records */}
        <TabsContent value="records" className="space-y-4">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/30 py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Individual Registrations Log</CardTitle>
                  <CardDescription className="text-xs">
                    Live patient and seva records for selected date range
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {records.length} records loaded
                </Badge>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Reg ID</th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Full Name</th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Mobile</th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Department</th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Location</th>
                    <th className="py-2.5 px-4 font-semibold text-muted-foreground">Created Date/Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No registration records to display.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="py-2 px-4 font-mono font-medium text-primary">#{r.id}</td>
                        <td className="py-2 px-4 font-medium text-foreground">{r.fullName || "-"}</td>
                        <td className="py-2 px-4 font-mono text-muted-foreground">{r.mobileNo || "-"}</td>
                        <td className="py-2 px-4">
                          <Badge variant="secondary" className="text-[11px] font-normal">
                            {r.department}
                          </Badge>
                        </td>
                        <td className="py-2 px-4 text-muted-foreground">{r.location}</td>
                        <td className="py-2 px-4 font-mono text-muted-foreground">{r.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
