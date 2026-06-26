import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ title, eyebrow, action, className, children }: SectionCardProps) {
  return (
    <section
      className={cn(
        "app-surface rounded-[28px] border p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">{eyebrow}</p> : null}
          <h2 className="mt-2 font-serif text-xl text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
