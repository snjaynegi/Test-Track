import { ChartCard } from "@/components/ChartCard";
import Empty from "@/components/Empty";
import { SectionCard } from "@/components/SectionCard";
import type { BootstrapPayload } from "../../shared/demo-data";

export default function Analytics({ data }: { data: BootstrapPayload }) {
  const hasAnalyticsData =
    data.charts.bugsBySeverity.length > 0 ||
    data.charts.bugsByProject.length > 0 ||
    data.testerPerformance.length > 0;

  if (!hasAnalyticsData) {
    return (
      <SectionCard title="Analytics" eyebrow="Insights">
        <Empty />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Severity Distribution" eyebrow="Risk Profile" kind="pie" data={data.charts.bugsBySeverity} />
        <ChartCard title="Project-wise Bug Distribution" eyebrow="Delivery Pressure" kind="column" data={data.charts.bugsByProject} />
      </div>

      <SectionCard title="Tester Productivity Metrics" eyebrow="Execution Statistics">
        <div className="overflow-hidden rounded-[24px] border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Tester</th>
                <th className="px-4 py-3">Executed</th>
                <th className="px-4 py-3">Bugs Raised</th>
                <th className="px-4 py-3">Closure Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/50">
              {!data.testerPerformance.length ? (
                <tr>
                  <td className="px-4 py-6" colSpan={4}>
                    <Empty />
                  </td>
                </tr>
              ) : null}
              {data.testerPerformance.map((tester) => (
                <tr key={tester.name}>
                  <td className="px-4 py-4">{tester.name}</td>
                  <td className="px-4 py-4">{tester.executed}</td>
                  <td className="px-4 py-4">{tester.bugsRaised}</td>
                  <td className="px-4 py-4">{tester.closureRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
