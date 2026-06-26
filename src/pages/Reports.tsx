import { useMemo, useState } from "react";
import { Download, FileText, Link2 } from "lucide-react";
import Empty from "@/components/Empty";
import { SectionCard } from "@/components/SectionCard";
import type { BootstrapPayload } from "../../shared/demo-data";

export default function Reports({ data }: { data: BootstrapPayload }) {
  const [selectedProjectId, setSelectedProjectId] = useState(data.projects[0]?.id ?? "");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["PDF", "DOCX", "XLSX"]);
  const hasProjects = data.projects.length > 0;

  const reportSnapshot = useMemo(() => {
    const project = data.projects.find((item) => item.id === selectedProjectId) ?? data.projects[0];
    const projectBugs = data.bugs.filter((bug) => bug.projectId === project?.id);
    const evidenceLinks = data.evidence.filter((item) => projectBugs.some((bug) => bug.id === item.bugId));
    return { project, projectBugs, evidenceLinks };
  }, [data.bugs, data.evidence, data.projects, selectedProjectId]);

  const toggleFormat = (format: string) => {
    setSelectedFormats((current) =>
      current.includes(format) ? current.filter((item) => item !== format) : [...current, format],
    );
  };

  const exportReport = (format: string) => {
    const content = [
      `Project: ${reportSnapshot.project?.name}`,
      `Testing Summary: ${reportSnapshot.projectBugs.length} bugs tracked`,
      `Critical Bugs: ${reportSnapshot.projectBugs.filter((bug) => bug.severity === "CRITICAL").length}`,
      "Evidence Links:",
      ...reportSnapshot.evidenceLinks.map((item) => `${item.fileName}: ${item.shareUrl}`),
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${reportSnapshot.project?.code?.toLowerCase() ?? "report"}-qa-report.${format.toLowerCase()}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Report Builder" eyebrow="Executive Exports">
        {!hasProjects ? (
          <Empty />
        ) : (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Project</span>
            <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="form-input">
              {data.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <div>
            <p className="mb-2 text-sm text-slate-300">Formats</p>
            <div className="flex flex-wrap gap-2">
              {["PDF", "DOCX", "XLSX"].map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => toggleFormat(format)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedFormats.includes(format)
                      ? "bg-cyan-300 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-200"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Reports include project info, testing summary, severity analysis, status analysis, tester performance, charts, and screenshot hyperlinks rather than embedded images.
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedFormats.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => exportReport(format)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                <Download className="h-4 w-4" />
                Export {format}
              </button>
            ))}
          </div>
        </div>
        )}
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Report Templates" eyebrow="Corporate Library">
          <div className="space-y-4">
            {!data.reportTemplates.length ? (
              <Empty />
            ) : null}
            {data.reportTemplates.map((template) => (
              <div key={template.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{template.name}</p>
                    <p className="text-sm text-slate-400">{template.audience}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{template.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.formats.map((format) => (
                    <span key={format} className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">{format}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Evidence Links in Reports" eyebrow="Hyperlink Strategy">
          <div className="space-y-3">
            {!reportSnapshot.evidenceLinks.length ? (
              <Empty />
            ) : null}
            {reportSnapshot.evidenceLinks.map((item) => (
              <a key={item.id} href={item.shareUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
                <span className="inline-flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-cyan-200" />
                  {item.fileName}
                </span>
                <FileText className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
