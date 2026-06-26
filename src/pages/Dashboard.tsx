import { AlertCircle, CheckCheck, Clock3, FolderGit2, Siren, TrendingUp } from "lucide-react";
import { ChartCard } from "@/components/ChartCard";
import Empty from "@/components/Empty";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import type { BootstrapPayload } from "../../shared/demo-data";

export default function Dashboard({ data }: { data: BootstrapPayload }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Bugs" value={data.metrics.totalBugs} delta="+12% this cycle" icon={FolderGit2} tone="cyan" />
        <StatCard label="Open Bugs" value={data.metrics.openBugs} delta="Needs triage" icon={AlertCircle} tone="amber" />
        <StatCard label="Closed Bugs" value={data.metrics.closedBugs} delta="Validated" icon={CheckCheck} tone="emerald" />
        <StatCard label="In Progress" value={data.metrics.inProgressBugs} delta="Assigned" icon={Clock3} tone="rose" />
        <StatCard label="Critical Bugs" value={data.metrics.criticalBugs} delta="Escalate today" icon={Siren} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Bug Distribution by Type" eyebrow="Quality Mix" kind="pie" data={data.charts.bugsByType} />
        <ChartCard title="Status Distribution" eyebrow="Workflow Balance" kind="pie" data={data.charts.bugsByStatus} />
        <ChartCard title="Project-wise Bug Load" eyebrow="Project Risk" kind="column" data={data.charts.bugsByProject} />
        <ChartCard title="Monthly Testing Progress" eyebrow="Execution Trend" kind="line" data={data.monthlyTrend} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Project Health Radar" eyebrow="Leadership View">
          <div className="space-y-4">
            {!data.projects.length ? (
              <Empty />
            ) : null}
            {data.projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">{project.name}</p>
                  <p className="text-sm text-slate-400">{project.summary}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{project.release}</span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{project.health}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Audit Pulse" eyebrow="Critical Actions">
          <div className="space-y-4">
            {!data.auditLog.length ? (
              <Empty />
            ) : null}
            {data.auditLog.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-cyan-200">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.action}</span>
                </div>
                <p className="mt-2 text-sm text-white">{item.target}</p>
                <p className="mt-1 text-xs text-slate-400">{item.actor} • {item.timestamp}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
