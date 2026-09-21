import { useState, useMemo } from "react";
import {
  Download,
  Printer,
  RotateCcw,
  Search,
  Users,
  Building2,
  BedDouble,
  Stethoscope,
  Calendar,
  BarChart3,
  Table as TableIcon,
  Layers,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  useGetReportMetadataQuery,
  useGetMasterReportQuery,
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
  Legend,
} from "recharts";

export function MasterReport() {
  const { data: metaResponse, isLoading: isMetaLoading } = useGetReportMetadataQuery();
  const availableDates = metaResponse?.data?.availableDates || [];

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [customDate, setCustomDate] = useState("");
  const [includeEmpty, setIncludeEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dateWise");

  // Effective query dates
  const queryDates = useMemo(() => {
    if (selectedDates.length > 0) return selectedDates.join(",");
    if (availableDates.length > 0) {
      // Pick top 3 dates
      return availableDates.slice(0, 3).map((d) => d.date).join(",");
    }
    return "";
  }, [selectedDates, availableDates]);

  const {
    data: reportResponse,
    isLoading: isReportLoading,
    isFetching,
    refetch,
  } = useGetMasterReportQuery(
    {
      dates: queryDates,
      includeEmpty,
    },
    { skip: isMetaLoading && availableDates.length === 0 }
  );

  const reportData = reportResponse?.data;
  const dateWise = reportData?.dateWise || [];
  const locationWise = reportData?.locationWise || [];
  const totals = reportData?.totals || { opd: 0, ipd: 0, total: 0 };
  const dates = reportData?.dates || [];
  const locations = reportData?.locations || [];

  // Handle toggling date pills
  const handleToggleDate = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      const next = selectedDates.filter((d) => d !== dateStr);
      setSelectedDates(next);
    } else {
      const next = [...selectedDates, dateStr].slice(-5);
      setSelectedDates(next);
    }
  };

  const handleAddCustomDate = () => {
    if (!customDate) return;
    if (!selectedDates.includes(customDate)) {
      setSelectedDates([...selectedDates, customDate].slice(-5));
    }
    setCustomDate("");
  };

  // KPI calculations
  const kpis = useMemo(() => {
    const totalFootfall = totals.total || 0;
    const totalOpd = totals.opd || 0;
    const totalIpd = totals.ipd || 0;
    const opdPercent = totalFootfall > 0 ? ((totalOpd / totalFootfall) * 100).toFixed(1) : "0";
    const ipdPercent = totalFootfall > 0 ? ((totalIpd / totalFootfall) * 100).toFixed(1) : "0";
    const activeCenters = locationWise.filter((l) => l.totals.total > 0).length;

    return {
      totalFootfall,
      totalOpd,
      totalIpd,
      opdPercent,
      ipdPercent,
      activeCenters,
    };
  }, [totals, locationWise]);

  // Analytics chart data
  const chartData = useMemo(() => {
    return locationWise
      .filter((l) => l.totals.total > 0 || includeEmpty)
      .map((l) => ({
        name: l.location,
        OPD: l.totals.opd,
        IPD: l.totals.ipd,
        Total: l.totals.total,
      }));
  }, [locationWise, includeEmpty]);

  // Filtered Date-wise list
  const filteredDateWise = useMemo(() => {
    if (!searchTerm.trim()) return dateWise;
    const term = searchTerm.toLowerCase();
    return dateWise.map((d) => ({
      ...d,
      rows: d.rows.filter((r) => r.label.toLowerCase().includes(term)),
    }));
  }, [dateWise, searchTerm]);

  // Filtered Location-wise list
  const filteredLocationWise = useMemo(() => {
    if (!searchTerm.trim()) return locationWise;
    const term = searchTerm.toLowerCase();
    return locationWise.filter((l) => l.location.toLowerCase().includes(term));
  }, [locationWise, searchTerm]);

  // Export handler
  const handleExportCsv = () => {
    if (!reportData) return;
    const headers = ["Report Date", "Location / Dispensary", "OPD", "IPD", "Total"];
    const exportRows: (string | number)[][] = [];

    dateWise.forEach((d) => {
      d.rows.forEach((r) => {
        exportRows.push([d.label, r.label, r.opd, r.ipd, r.total]);
      });
      // Subtotal
      exportRows.push([`${d.label} Subtotal`, "", d.totals.opd, d.totals.ipd, d.totals.total]);
    });

    // Grand total
    exportRows.push(["GRAND TOTAL", "", totals.opd, totals.ipd, totals.total]);

    exportToCsv(`master_report_${dates.join("_")}`, headers, exportRows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dispensary Master Report
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              Consolidated Analytics
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Executive overview of OPD and IPD footfall across dispensary centers and samagam dates.
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
            Print Report
          </Button>

          <Button
            size="sm"
            onClick={handleExportCsv}
            disabled={!reportData || totals.total === 0}
            className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter & Date Selection Bar */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Quick Pick Date Pills */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" />
                <span>Select Dates for Master Consolidation:</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {availableDates.slice(0, 6).map((item) => {
                  const isSelected = dates.includes(item.date);
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
                placeholder="Filter locations / dispensaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            {/* Toggle empty departments */}
            <div className="flex items-center gap-2">
              <Switch
                id="includeEmptyMaster"
                checked={includeEmpty}
                onCheckedChange={setIncludeEmpty}
              />
              <Label htmlFor="includeEmptyMaster" className="text-xs font-medium cursor-pointer">
                Include zero-activity centers
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
              Grand Total Footfall
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
                  {kpis.totalFootfall.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Combined OPD + IPD visits
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total OPD Patients
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Stethoscope className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.totalOpd.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.opdPercent}% of total patient volume
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total IPD / In-Patient
            </CardTitle>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <BedDouble className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.totalIpd.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpis.ipdPercent}% of total admissions
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
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isReportLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {kpis.activeCenters}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of {locations.length} total centers
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
            <TabsTrigger value="dateWise" className="gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Date-wise Breakdown
            </TabsTrigger>
            <TabsTrigger value="locationWise" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Location-wise Breakdown
            </TabsTrigger>
            <TabsTrigger value="consolidated" className="gap-1.5 text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Consolidated Summary Matrix
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              OPD vs IPD Comparison
            </TabsTrigger>
          </TabsList>
          <div className="text-xs text-muted-foreground hidden sm:block">
            {dates.length} Dates × {locations.length} Locations
          </div>
        </div>

        {/* Tab 1: Date-wise Breakdown */}
        <TabsContent value="dateWise" className="space-y-6">
          {isReportLoading ? (
            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-32 w-full" />
            </Card>
          ) : filteredDateWise.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No master report data found for selected dates.</p>
            </Card>
          ) : (
            filteredDateWise.map((dateCard) => (
              <Card key={dateCard.date} className="border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/40 py-3 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">
                      Date: {dateCard.label} ({dateCard.date})
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      Subtotal: {dateCard.totals.total.toLocaleString()} visits
                    </Badge>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/20 border-b border-border">
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground w-12 text-center">#</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground">Location / Dispensary</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">OPD</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">IPD</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">Total</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-right w-44">OPD vs IPD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dateCard.rows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            No active records on this date.
                          </td>
                        </tr>
                      ) : (
                        dateCard.rows.map((row, idx) => {
                          const opdRatio = row.total > 0 ? (row.opd / row.total) * 100 : 100;
                          return (
                            <tr key={row.label} className="hover:bg-muted/20 transition-colors">
                              <td className="py-2.5 px-4 text-center text-muted-foreground font-mono">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-4 font-medium text-foreground">
                                {row.label}
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                {row.opd > 0 ? row.opd.toLocaleString() : "-"}
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono font-medium text-indigo-600 dark:text-indigo-400">
                                {row.ipd > 0 ? row.ipd.toLocaleString() : "-"}
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono font-bold text-foreground">
                                {row.total.toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[10px] text-muted-foreground">
                                    {row.opd}:{row.ipd}
                                  </span>
                                  <div className="w-20 bg-indigo-200 dark:bg-indigo-900 rounded-full h-1.5 overflow-hidden flex">
                                    <div
                                      className="bg-emerald-500 h-full"
                                      style={{ width: `${opdRatio}%` }}
                                      title={`OPD: ${row.opd}, IPD: ${row.ipd}`}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/40 font-bold border-t border-border">
                        <td className="py-2.5 px-4 text-center font-mono">Σ</td>
                        <td className="py-2.5 px-4 uppercase tracking-wider text-xs">Day Subtotal</td>
                        <td className="py-2.5 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400">
                          {dateCard.totals.opd.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-indigo-600 dark:text-indigo-400">
                          {dateCard.totals.ipd.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-foreground font-bold">
                          {dateCard.totals.total.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab 2: Location-wise Breakdown */}
        <TabsContent value="locationWise" className="space-y-6">
          {filteredLocationWise.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No locations match your filter.</p>
            </Card>
          ) : (
            filteredLocationWise.map((locCard) => (
              <Card key={locCard.location} className="border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/40 py-3 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">
                      Location: {locCard.location}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs font-mono">
                    Total Served: {locCard.totals.total.toLocaleString()}
                  </Badge>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/20 border-b border-border">
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground">Report Date</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">OPD</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">IPD</th>
                        <th className="py-2.5 px-4 font-semibold text-muted-foreground text-center w-28">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {locCard.rows.map((r) => (
                        <tr key={r.date} className="hover:bg-muted/20">
                          <td className="py-2 px-4 font-medium text-foreground">{r.label}</td>
                          <td className="py-2 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400">
                            {r.opd > 0 ? r.opd.toLocaleString() : "-"}
                          </td>
                          <td className="py-2 px-4 text-center font-mono text-indigo-600 dark:text-indigo-400">
                            {r.ipd > 0 ? r.ipd.toLocaleString() : "-"}
                          </td>
                          <td className="py-2 px-4 text-center font-mono font-bold text-foreground">
                            {r.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/40 font-bold border-t border-border">
                        <td className="py-2.5 px-4 uppercase tracking-wider text-xs">Center Total</td>
                        <td className="py-2.5 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400">
                          {locCard.totals.opd.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-indigo-600 dark:text-indigo-400">
                          {locCard.totals.ipd.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-foreground font-bold">
                          {locCard.totals.total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab 3: Consolidated Summary Matrix */}
        <TabsContent value="consolidated" className="space-y-4">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b bg-muted/40">
              <CardTitle className="text-sm font-semibold">Master Consolidated Matrix</CardTitle>
              <CardDescription className="text-xs">
                Complete comparison of all dispensary locations across all dates
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="py-3 px-4 font-semibold text-muted-foreground w-12 text-center">#</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground min-w-[180px]">Location</th>
                    {dates.map((d) => (
                      <th key={d} className="py-3 px-3 font-semibold text-muted-foreground text-center min-w-[90px]">
                        {d}
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[80px] text-emerald-600">
                      Total OPD
                    </th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[80px] text-indigo-600">
                      Total IPD
                    </th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground text-center min-w-[90px] bg-muted/80">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {locationWise.map((loc, idx) => (
                    <tr key={loc.location} className="hover:bg-muted/20">
                      <td className="py-2 px-4 text-center text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-2 px-4 font-medium text-foreground">{loc.location}</td>
                      {dates.map((d) => {
                        const cell = loc.rows.find((r) => r.date === d);
                        const cnt = cell?.total || 0;
                        return (
                          <td key={d} className="py-2 px-3 text-center font-mono">
                            {cnt > 0 ? cnt.toLocaleString() : "-"}
                          </td>
                        );
                      })}
                      <td className="py-2 px-4 text-center font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        {loc.totals.opd.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-center font-mono font-medium text-indigo-600 dark:text-indigo-400">
                        {loc.totals.ipd.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-center font-mono font-bold text-foreground bg-muted/30">
                        {loc.totals.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-primary/10 border-t-2 border-primary/30 font-bold text-foreground">
                    <td className="py-3 px-4 text-center font-mono">Σ</td>
                    <td className="py-3 px-4 uppercase tracking-wider text-xs">Total</td>
                    {dates.map((d) => {
                      const dayCard = dateWise.find((card) => card.date === d);
                      return (
                        <td key={d} className="py-3 px-3 text-center font-mono text-primary text-sm">
                          {(dayCard?.totals.total || 0).toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400">
                      {totals.opd.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-indigo-600 dark:text-indigo-400">
                      {totals.ipd.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-primary text-base bg-primary/20">
                      {totals.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 4: Executive Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">OPD vs IPD Service Volume by Center</CardTitle>
              <CardDescription>
                Comparison of Out-Patient and In-Patient medical services delivered across locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No data to display in chart.
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
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
                      <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} patients`, ""]} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="OPD" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="IPD" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
