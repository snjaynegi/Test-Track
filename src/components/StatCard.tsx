import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  delta: string;
  icon: LucideIcon;
  tone: "cyan" | "amber" | "emerald" | "rose";
}

const toneClasses = {
  cyan: "from-cyan-500/20 to-cyan-500/0 text-cyan-200 ring-cyan-300/20",
  amber: "from-amber-500/20 to-amber-500/0 text-amber-200 ring-amber-300/20",
  emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-200 ring-emerald-300/20",
  rose: "from-rose-500/20 to-rose-500/0 text-rose-200 ring-rose-300/20",
};

export function StatCard({ label, value, delta, icon: Icon, tone }: StatCardProps) {
  return (
    <div className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${toneClasses[tone]} p-5 ring-1`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">{label}</p>
        <span className="rounded-full bg-white/10 p-2">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="font-serif text-4xl text-white">{value}</p>
        <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{delta}</p>
      </div>
    </div>
  );
}
