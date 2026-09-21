import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  RotateCcw,
  Search,
  Users,
  Building2,
  MapPin,
  Calendar,
  BarChart3,
  Table as TableIcon,
  PieChart as PieIcon,
  CheckCircle2,
} from "lucide-react";
import {
  useGetReportMetadataQuery,
  useGetDailyReportQuery,
  type DailyReportRow,
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
  PieChart,
  Pie,
} from "recharts";

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4",
  "#ec4899", "#f97316", "#6366f1", "#14b8a6", "#84cc16",
];

export function DailyReport() {
  const { data: metaResponse, isLoading: isMetaLoading } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customDate, setCustomDate] = useState("");
  const [includeEmpty, setIncludeEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("matrix");

  // Effective query date: selectedDate or best available date
  const queryDate = useMemo(() => {
    if (selectedDate) return selectedDate;
    if (availableDates.length > 0) {
      const best = availableDates.find((d) => d.count > 10) || availableDates[0];
      return best.date;
    }
    return "";
  }, [selectedDate, availableDates]);

  const {
    data: reportResponse,
    isLoading: isReportLoading,
    isFetching,
    refetch,
  } = useGetDailyReportQuery(
    {
      date: queryDate,
      includeEmpty,
    },
    { skip: isMetaLoading && availableDates.length === 0 }
  );

  const reportData = reportResponse?.data;
  const rows: DailyReportRow[] = reportData?.rows || [];
  const columns = reportData?.columns || [];
  const totals = reportData?.totals || { byLocation: {}, grandTotal: 0 };
  const reportDate = reportData?.date || queryDate;
  const reportDateLabel = reportData?.dateLabel || reportDate;

  // Filter rows by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((r) => r.department.toLowerCase().includes(term));
  }, [rows, searchTerm]);

  // Derived KPIs
  const kpis = useMemo(() => {
    const totalDayVisits = totals.grandTotal || 0;
    const activeDepts = rows.filter((r) => r.total > 0).length;

    // Busiest department
    const topDept = [...rows].sort((a, b) => b.total - a.total)[0];
    const topDeptName = topDept && topDept.total > 0 ? topDept.department : "None";
    const topDeptCount = topDept?.total || 0;

    // Busiest location
    let topLocName = "None";
    let topLocCount = 0;
    Object.entries(totals.byLocation || {}).forEach(([loc, count]) => {
      if (count > topLocCount) {
        topLocCount = count;
        topLocName = loc;
      }
    });

    // Active locations
    const activeLocationsCount = Object.values(totals.byLocation || {}).filter((c) => c > 0).length;

    return {
      totalDayVisits,
      activeDepts,
      topDeptName,
      topDeptCount,
      topLocName,
      topLocCount,
      activeLocationsCount,
    };
  }, [rows, totals]);

  // Location comparison chart data
  const locationChartData = useMemo(() => {
    return Object.entries(totals.byLocation || {})
      .filter(([_, count]) => count > 0 || includeEmpty)
      .map(([loc, count], index) => ({
        name: loc,
        count,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [totals.byLocation, includeEmpty]);

  // Department distribution pie chart data (top 6 + Other)
  const departmentPieData = useMemo(() => {
    const activeRows = [...rows].filter((r) => r.total > 0).sort((a, b) => b.total - a.total);
    if (activeRows.length <= 6) {
      return activeRows.map((r, i) => ({
        name: r.department,
        value: r.total,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      }));
    }

    const top5 = activeRows.slice(0, 5);
    const otherTotal = activeRows.slice(5).reduce((sum, r) => sum + r.total, 0);

    const result = top5.map((r, i) => ({
      name: r.department,
      value: r.total,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

    result.push({
      name: "Other Departments",
      value: otherTotal,
      fill: "#94a3b8",
    });

    return result;
  }, [rows]);

  // Export handler
  const handleExportCsv = () => {
    if (!reportData) return;
    const headers = [
      "Department",
      ...columns.map((c) => c.label),
      "Total",
    ];

    const exportRows = rows.map((r) => [
      r.department,
      ...columns.map((c) => r.values[c.key] || 0),
      r.total,
    ]);

    // Add totals row
    exportRows.push([
      "GRAND TOTAL",
      ...columns.map((c) => totals.byLocation[c.key] || 0),
      totals.grandTotal,
    ]);

    exportToCsv(`daily_report_${reportDate}`, headers, exportRows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Daily Operational Report
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
              {reportDateLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Department-by-dispensary cross-tabulation matrix, footfall distribution, and point-of-care totals.
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
            Print Matrix
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
                <span>Select Report Date:</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {availableDates.slice(0, 7).map((item) => {
                  const isSelected = queryDate === item.date;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => setSelectedDate(item.date)}
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
                onClick={() => {
                  if (customDate) {
                    setSelectedDate(customDate);
                    setCustomDate("");
                  }
                }}
                disabled={!customDate}
                className="h-9 text-xs"
              >
                Set Date
              </Button>
            </div>
          </div>

          <div className="border-t pt-3 flex flex-wrap items-center justify-between gap-3">
            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments in matrix..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            {/* Toggle empty departments */}
            <div className="flex items-center gap-2">
              <Switch
                id="includeEmptyDaily"
                checked={includeEmpty}
                onCheckedChange={setIncludeEmpty}
              />
              <Label htmlFor="includeEmptyDaily" className="text-xs font-medium cursor-pointer">
                Include zero-count rows
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
              Total Day Visits
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
                  {kpis.totalDayVisits.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total footfall across all locations on {reportDateLabel}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Busiest Department
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-xl font-bold text-foreground truncate" title={kpis.topDeptName}>
                  {kpis.topDeptName}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.topDeptCount.toLocaleString()} visits (
                  {kpis.totalDayVisits > 0
                    ? ((kpis.topDeptCount / kpis.totalDayVisits) * 100).toFixed(1)
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
              Busiest Dispensary / Location
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-xl font-bold text-foreground truncate" title={kpis.topLocName}>
                  {kpis.topLocName}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.topLocCount.toLocaleString()} visits recorded
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Dispensary Points
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.activeLocationsCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of {columns.length} total dispensary points
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="matrix" className="gap-1.5 text-xs">
              <TableIcon className="h-3.5 w-3.5" />
              2D Cross-Tabulation Matrix
            </TabsTrigger>
            <TabsTrigger value="locations" className="gap-1.5 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              Location Comparison
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-1.5 text-xs">
              <PieIcon className="h-3.5 w-3.5" />
              Department Share
            </TabsTrigger>
          </TabsList>
          <div className="text-xs text-muted-foreground hidden sm:block">
            {columns.length} Locations × {filteredRows.length} Departments
          </div>
        </div>

        {/* Tab 1: 2D Matrix Table */}
        <TabsContent value="matrix" className="space-y-4">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="py-3 px-4 font-semibold text-muted-foreground w-12 text-center">#</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground min-w-[200px] sticky left-0 bg-muted/60 z-10">
                      Department
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="py-3 px-3 font-semibold text-muted-foreground text-center min-w-[100px]"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[110px] bg-muted/80">
                      Total
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
                          <td key={col.key} className="py-3 px-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                        ))}
                        <td className="py-3 px-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 3}
                        className="py-12 text-center text-muted-foreground"
                      >
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="font-medium">No activity recorded for this date.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select one of the dates highlighted above with available records.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, index) => (
                      <tr
                        key={row.department}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-2.5 px-4 text-center text-muted-foreground font-mono">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-foreground sticky left-0 bg-background/95 hover:bg-muted/30">
                          {row.department}
                        </td>
                        {columns.map((col) => {
                          const val = row.values[col.key] || 0;
                          return (
                            <td
                              key={col.key}
                              className={`py-2.5 px-3 text-center font-mono ${
                                val > 0
                                  ? "font-semibold text-foreground bg-primary/5"
                                  : "text-muted-foreground/40"
                              }`}
                            >
                              {val > 0 ? val.toLocaleString() : "-"}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-foreground bg-muted/40">
                          {row.total.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-primary/10 border-t-2 border-primary/30 font-bold text-foreground">
                      <td className="py-3 px-4 text-center font-mono">Σ</td>
                      <td className="py-3 px-4 uppercase tracking-wider text-xs sticky left-0 bg-primary/10">
                        Total by Location
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="py-3 px-3 text-center font-mono text-primary text-sm"
                        >
                          {(totals.byLocation[col.key] || 0).toLocaleString()}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center font-mono text-primary text-base bg-primary/20">
                        {totals.grandTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Location Comparison */}
        <TabsContent value="locations" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Footfall by Dispensary & Langar Location</CardTitle>
              <CardDescription>
                Visual comparison of visits served at each service location point on {reportDateLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {locationChartData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No data to display in chart for this date.
                </div>
              ) : (
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-25}
                        textAnchor="end"
                        interval={0}
                        height={50}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(val: any) => [`${Number(val).toLocaleString()} visits`, "Total"]}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {locationChartData.map((entry, index) => (
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

        {/* Tab 3: Department Share */}
        <TabsContent value="departments" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Department Workload Distribution</CardTitle>
              <CardDescription>
                Proportional breakdown of clinical services utilized on {reportDateLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {departmentPieData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No data to display for this date.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={50}
                          paddingAngle={2}
                          label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        >
                          {departmentPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any) => [`${Number(val).toLocaleString()} visits`, "Count"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Distribution Breakdown
                    </h4>
                    {departmentPieData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-border/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-sm shrink-0"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                          <span>{item.value.toLocaleString()}</span>
                          <span className="text-muted-foreground w-12 text-right">
                            {totals.grandTotal > 0
                              ? ((item.value / totals.grandTotal) * 100).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
