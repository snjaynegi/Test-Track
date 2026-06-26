import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyProps {
  message?: string;
  className?: string;
}

export default function Empty({ message = "No Data Available", className }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/5 p-6 text-center",
        className,
      )}
    >
      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
        <Database className="h-5 w-5" />
      </span>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
  );
}
