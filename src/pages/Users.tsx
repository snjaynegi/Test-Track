import { Lock, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import type { BootstrapPayload } from "../../shared/demo-data";

export default function Users({ data }: { data: BootstrapPayload }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SectionCard title="QA Team Directory" eyebrow="QA Access">
        <div className="space-y-4">
          {data.users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-slate-950">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{user.role.replace(/_/g, " ")}</span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">{user.projectIds.length} projects</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Security Controls" eyebrow="Validation & Audit">
        <div className="space-y-4 text-sm text-slate-300">
          {[
            "Unified QA access grants bug creation, evidence validation, and test management across all modules.",
            "Attachment workflows support image and video file filtering before submission.",
            "Duplicate detection warns when project title and environment collide with existing records.",
            "Report exports keep screenshots as clickable hyperlinks rather than embedded images.",
            "Critical actions are surfaced through an audit pulse for operational visibility.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
              <span>{item}</span>
            </div>
          ))}
          <div className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-50">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Production hardening next step: connect authentication, database persistence, and protected media storage to replace in-memory demo data.
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
