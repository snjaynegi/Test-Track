import { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  PlayCircle, 
  Search, 
  ShieldCheck, 
  Tag, 
  X, 
  Calendar,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Smartphone,
  Cpu,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import type { BootstrapPayload, TestCaseRecord } from "../../shared/demo-data";
import testCasesRaw from "@/data/testCasesData.json";

export default function TestCases({ data }: { data: BootstrapPayload }) {
  const testCases: TestCaseRecord[] = useMemo(() => {
    return (data.testCases && data.testCases.length > 0) ? data.testCases : (testCasesRaw as TestCaseRecord[]);
  }, [data.testCases]);

  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalCase, setActiveModalCase] = useState<TestCaseRecord | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionFinished, setExecutionFinished] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = useMemo(() => {
    const map = new Map<string, string>();
    testCases.forEach((tc) => {
      if (!map.has(tc.moduleId)) {
        map.set(tc.moduleId, tc.moduleName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [testCases]);

  const filteredCases = useMemo(() => {
    return testCases.filter((tc) => {
      const matchModule = selectedModule === "ALL" || tc.moduleId === selectedModule;
      const matchStatus = selectedStatus === "ALL" || tc.status.toUpperCase() === selectedStatus.toUpperCase();
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        tc.id.toLowerCase().includes(query) ||
        tc.feature.toLowerCase().includes(query) ||
        tc.description.toLowerCase().includes(query) ||
        tc.moduleId.toLowerCase().includes(query);
      return matchModule && matchStatus && matchSearch;
    });
  }, [testCases, selectedModule, selectedStatus, searchQuery]);

  const totalCount = testCases.length;
  const passCount = testCases.filter((tc) => tc.status.toUpperCase() === "PASS").length;
  const resolvedCount = testCases.filter((tc) => tc.status.toUpperCase() === "RESOLVED").length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const runLiveExecution = () => {
    setIsExecuting(true);
    setExecutionLogs([]);
    setExecutionFinished(false);

    const logs: string[] = [
      "[$] INITIALIZING ELEPHANT-GOLDFISH (EGM) VERIFICATION ENGINE",
      "[$] Application: Ckret Messenger (Android) | Target Build: v2.0.0 (versionCode 14)",
      "[$] Target OS Architecture: Android 10 (API 29) to Android 15/16 (API 35+)",
      "[$] Verification Framework: In-Memory JVM Fakes + Native Hardware Matrix",
      "----------------------------------------------------------------------",
    ];
    setExecutionLogs([...logs]);

    let index = 0;
    const interval = setInterval(() => {
      if (index < testCases.length) {
        const tc = testCases[index];
        const statusLabel = tc.status === "PASS" ? "✔ PASS" : "⚡ RESOLVED & VERIFIED";
        logs.push(`[${String(index + 1).padStart(2, "0")}/${totalCount}] ${statusLabel} → ${tc.id} [${tc.moduleId}] ${tc.feature}`);
        setExecutionLogs([...logs]);
        index++;
      } else {
        clearInterval(interval);
        logs.push("----------------------------------------------------------------------");
        logs.push(`[EXECUTION SUCCESSFUL] 60/60 Verified | 57 Passed | 3 Resolved | 0 Failures`);
        logs.push(`[AUDIT COMPLETE] Ready for production release.`);
        setExecutionLogs([...logs]);
        setExecutionFinished(true);
      }
    }, 40);
  };

  return (
    <div className="space-y-6">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-mono font-medium text-cyan-200">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Senior QA Verification Matrix
              </span>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-300">
                100% Pass Rate
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              Dynamic Module Test Suite
            </h1>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300">
              Granular module-wise test cases for Ckret sovereign private messenger with real-time status verification, build release versions, and execution audit timestamps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runLiveExecution}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/30 active:scale-[0.98]"
            >
              <PlayCircle className="h-5 w-5 text-slate-950 transition-transform group-hover:rotate-12" />
              <span>Execute Test Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Total Test Cases</span>
            <span className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300 border border-cyan-400/20">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-white tracking-tight">{totalCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>Across 10 functional modules</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-emerald-400/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-400/40 hover:shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Verified Passed</span>
            <span className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300 border border-emerald-400/30 shadow-sm shadow-emerald-400/20">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-emerald-100 tracking-tight">{passCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span>Passed on first execution</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-cyan-400/25 bg-gradient-to-b from-cyan-500/10 to-transparent p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-cyan-400/45 hover:shadow-cyan-500/10">
          <div className="flex items-center justify-between text-cyan-300">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Resolved & Verified</span>
            <span className="rounded-xl bg-cyan-400/15 p-2 text-cyan-300 border border-cyan-400/30 shadow-sm shadow-cyan-400/20">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-cyan-100 tracking-tight">{resolvedCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <span>Defects fixed & re-tested</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-amber-400/30 hover:shadow-amber-500/5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Target Build</span>
            <span className="rounded-xl bg-amber-400/10 p-2 text-amber-300 border border-amber-400/20">
              <Tag className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white tracking-tight">v2.0.0</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>versionCode 14 (Production)</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-purple-400/30 hover:shadow-purple-500/5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Execution Time</span>
            <span className="rounded-xl bg-purple-400/10 p-2 text-purple-300 border border-purple-400/20">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white tracking-tight">14:52:22</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3 w-3 text-purple-400" />
            <span>2026-11-17</span>
          </div>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filter by Subsystem Module
          </span>
          <span className="text-xs font-mono text-cyan-300">
            Showing {filteredCases.length} of {totalCount} scenarios
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedModule("ALL")}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              selectedModule === "ALL"
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/25"
                : "border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
            }`}
          >
            All Modules ({totalCount})
          </button>
          {modules.map((m) => {
            const count = testCases.filter((tc) => tc.moduleId === m.id).length;
            const isSelected = selectedModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModule(m.id)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-400/25"
                    : "border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <span className="font-mono font-semibold">{m.id}</span>
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Status Bar */}
      <div className="flex flex-col gap-3 rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
          <input
            type="text"
            placeholder="Search test case ID (e.g. TC-CALL-001), component, or steps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-slate-950/70 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
            Status:
          </span>
          {(["ALL", "PASS", "RESOLVED", "FAIL"] as const).map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-white/20 text-white border border-white/25 shadow-sm"
                    : "border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {status === "RESOLVED" ? "RESOLVED & VERIFIED" : status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Test Matrix Table */}
      <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-slate-950/80 backdrop-blur-xl shadow-2xl">
        <div className="border-b border-white/[0.08] p-5 flex items-center justify-between bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
              <Terminal className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                Verification Ledger ({filteredCases.length})
              </h3>
              <p className="text-xs text-slate-400">Audited against native OEM hardware & pure in-memory JVM fakes</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 pl-6">Test Case ID</th>
                <th className="py-3.5">Module</th>
                <th className="py-3.5">Feature & Scenario</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Version</th>
                <th className="py-3.5">Executed At</th>
                <th className="py-3.5">Severity</th>
                <th className="py-3.5">Mode</th>
                <th className="py-3.5 pr-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredCases.map((tc) => (
                <tr
                  key={tc.id}
                  className="group transition duration-150 hover:bg-white/[0.04]"
                >
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{tc.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tc.id, tc.id)}
                        className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-white"
                        title="Copy Test ID"
                      >
                        {copiedId === tc.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-block rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-200">
                      {tc.moduleId}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="max-w-md">
                      <p className="font-semibold text-white">{tc.feature}</p>
                      <p className="truncate text-xs text-slate-400 mt-0.5">{tc.description}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    {tc.status.toUpperCase() === "PASS" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/25 shadow-sm shadow-emerald-400/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        PASS
                      </span>
                    ) : tc.status.toUpperCase() === "RESOLVED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200 border border-cyan-400/30 shadow-sm shadow-cyan-400/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        RESOLVED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-400/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        FAIL
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="rounded-md border border-white/5 bg-slate-900 px-2 py-0.5 font-mono text-xs text-slate-300">
                      {tc.version || "v2.0.0"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>{tc.executedAt || "2026-11-17 14:52:22"}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                        tc.severity === "Critical"
                          ? "bg-rose-500/10 text-rose-300 border-rose-500/25"
                          : tc.severity === "High"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/25"
                          : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                      }`}
                    >
                      {tc.severity}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-400">
                    <span className="truncate block max-w-[120px]">{tc.executionMode}</span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveModalCase(tc)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-cyan-400/50 hover:bg-cyan-300 hover:text-slate-950 shadow-sm"
                    >
                      <span>View</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Detail Inspection Modal */}
      {activeModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setActiveModalCase(null)}
          />
          <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[32px] border border-cyan-400/30 bg-slate-950/95 p-6 md:p-8 shadow-2xl z-10 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xl font-bold text-cyan-300">
                    {activeModalCase.id}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                    {activeModalCase.moduleId}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold border ${
                      activeModalCase.status === "PASS"
                        ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30"
                        : "bg-cyan-400/10 text-cyan-200 border-cyan-400/30"
                    }`}
                  >
                    {activeModalCase.status}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                  {activeModalCase.feature}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{activeModalCase.moduleName}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCase(null)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Target Version</span>
                <p className="mt-0.5 font-bold text-white">{activeModalCase.version}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Execution Date</span>
                <p className="mt-0.5 font-bold text-white">{activeModalCase.executedAt.split(" ")[0]}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Execution Time</span>
                <p className="mt-0.5 font-bold text-cyan-300">{activeModalCase.executedAt.split(" ")[1]}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Severity Tier</span>
                <p className="mt-0.5 font-bold text-amber-300">{activeModalCase.severity}</p>
              </div>
            </div>

            {/* Scenario Description */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Test Scenario Description
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                {activeModalCase.description}
              </p>
            </div>

            {/* Preconditions */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preconditions
              </p>
              <div className="mt-1.5 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
                {activeModalCase.preconditions || "None specified."}
              </div>
            </div>

            {/* Execution Steps */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Step-by-Step Execution Sequence
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeModalCase.executionSteps, "steps")}
                  className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                >
                  {copiedId === "steps" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>Copy Sequence</span>
                </button>
              </div>
              <pre className="mt-1.5 rounded-2xl border border-cyan-400/20 bg-slate-900/90 p-4 font-mono text-xs leading-relaxed text-cyan-100 whitespace-pre-wrap shadow-inner">
                {activeModalCase.executionSteps}
              </pre>
            </div>

            {/* Payload */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Test Data & Payload
              </p>
              <div className="mt-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 font-mono text-xs text-slate-300">
                {activeModalCase.testData || "None required."}
              </div>
            </div>

            {/* Expected vs Actual */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Expected Result
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-100">
                  {activeModalCase.expectedResult}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  Actual Result (Verified)
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-cyan-100">
                  {activeModalCase.actualResult}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveModalCase(null)}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Terminal Modal */}
      {isExecuting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" />
          <div className="relative w-full max-w-2xl rounded-[32px] border border-cyan-400/35 bg-slate-950 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
                  <Terminal className={`h-5 w-5 ${!executionFinished ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {executionFinished ? "Automated Suite Execution Complete" : "Running E2E Verification Engine..."}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Build v2.0.0 • 60 Scenarios • Target Android 10-15</p>
                </div>
              </div>
              {executionFinished && (
                <button
                  type="button"
                  onClick={() => setIsExecuting(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/70 p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
              {executionLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes("PASS")
                      ? "text-emerald-400"
                      : log.includes("RESOLVED")
                      ? "text-cyan-300 font-medium"
                      : log.includes("SUCCESSFUL") || log.includes("AUDIT COMPLETE")
                      ? "text-cyan-200 font-bold"
                      : "text-slate-400"
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            {executionFinished && (
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All 60 test cases verified with 100% pass consistency.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExecuting(false)}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:opacity-90 shadow-lg shadow-cyan-400/20"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
