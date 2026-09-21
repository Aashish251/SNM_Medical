import { Users, UserCheck, FileText, Heart } from "lucide-react";

type MasterSearchStatsProps = {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
};

export function MasterSearchStats({
  totalUsers,
  activeUsers,
  pendingUsers,
}: MasterSearchStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100/90 bg-blue-50/40 p-3.5 shadow-xs transition-all hover:bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Users
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100/90 bg-emerald-50/40 p-3.5 shadow-xs transition-all hover:bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
          <UserCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {activeUsers.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active Users
          </div>
        </div>
      </div>

      {/* Pending Users */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-amber-100/90 bg-amber-50/40 p-3.5 shadow-xs transition-all hover:bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {pendingUsers.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pending Users
          </div>
        </div>
      </div>

      {/* Inspiration Quote Banner */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/80 to-blue-50/30 p-3.5 px-4 shadow-xs dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex items-center gap-1.5 text-xs font-medium italic text-slate-700 dark:text-slate-300">
          <span className="text-sm font-serif font-bold text-blue-500">“</span>
          <span>Serving with compassion for a healthier tomorrow.</span>
          <span className="text-sm font-serif font-bold text-blue-500">”</span>
        </div>
        <div className="mt-1 flex items-center gap-1 self-end text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>— Medical Sewa</span>
          <Heart className="h-3 w-3 fill-blue-500 text-blue-500" />
        </div>
      </div>
    </div>
  );
}
