import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SectionCard } from "@/components/SectionCard";
import { useTheme } from "@/hooks/useTheme";

interface ChartCardProps {
  title: string;
  eyebrow: string;
  kind: "pie" | "column" | "line";
  data: Array<{ name: string; y: number }> | Array<{ name: string; tested: number; passed: number }>;
}

export function ChartCard({ title, eyebrow, kind, data }: ChartCardProps) {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const legendColor = theme === "dark" ? "#e2e8f0" : "#334155";
  const gridColor = theme === "dark" ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.3)";
  const connectorColor = theme === "dark" ? "#334155" : "#cbd5e1";

  const options: Highcharts.Options =
    kind === "line"
      ? {
          chart: { type: "line", backgroundColor: "transparent" },
          title: { text: undefined },
          credits: { enabled: false },
          xAxis: { categories: data.map((item) => item.name), labels: { style: { color: axisColor } } },
          yAxis: { title: { text: undefined }, labels: { style: { color: axisColor } }, gridLineColor: gridColor },
          legend: { itemStyle: { color: legendColor } },
          series: [
            { type: "line", name: "Executed", data: data.map((item) => item.tested), color: "#22d3ee" },
            { type: "line", name: "Passed", data: data.map((item) => item.passed), color: "#34d399" },
          ],
        }
      : {
          chart: { type: kind, backgroundColor: "transparent" },
          title: { text: undefined },
          credits: { enabled: false },
          xAxis: kind === "column" ? { categories: data.map((item) => item.name), labels: { style: { color: axisColor } } } : undefined,
          yAxis: kind === "column" ? { title: { text: undefined }, labels: { style: { color: axisColor } }, gridLineColor: gridColor } : undefined,
          legend: { itemStyle: { color: legendColor } },
          plotOptions: {
            pie: {
              innerSize: "58%",
              dataLabels: { color: legendColor, connectorColor },
            },
            column: { borderRadius: 10, color: "#22d3ee" },
          },
          series: [{ type: kind, data: data as Array<{ name: string; y: number }> }],
        };

  return (
    <SectionCard title={title} eyebrow={eyebrow}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </SectionCard>
  );
}
