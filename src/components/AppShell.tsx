import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  Activity, 
  Boxes, 
  Bug, 
  CheckCircle2, 
  ChevronRight, 
  FileSpreadsheet, 
  Flame, 
  Gauge, 
  ListChecks, 
  LogOut, 
  Moon, 
  Radio, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  Users2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/hooks/useAppStore";

const navItems = [
  { to: "/dashboard", label: "Executive Dashboard", icon: Gauge, badge: "Live" },
  { to: "/projects", label: "Project Registry", icon: Boxes, badge: "1 Active" },
  { to: "/test-cases", label: "Test Cases Suite", icon: ListChecks, badge: "60 Cases" },
  { to: "/bugs", label: "Bug Management", icon: Bug, badge: "3 Logged" },
  { to: "/reports", label: "Audit Reports", icon: FileSpreadsheet },
  { to: "/analytics", label: "Quality Analytics", icon: Activity },
  { to: "/users", label: "QA Team Matrix", icon: Users2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, clearSession } = useAppStore();
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout: number | undefined;

    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsScrolling(false), 140);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="app-shell-bg min-h-screen font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 lg:px-6">
        {/* Modern Sidebar */}
        <aside
          className={cn(
            "app-surface sticky top-4 hidden h-[calc(100vh-2rem)] w-76 flex-col overflow-y-auto rounded-[32px] border border-white/[0.08] p-5 backdrop-blur-xl lg:flex shadow-2xl",
            isScrolling && "shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          )}
        >
          {/* Logo & Brand Header */}
          <Link
            to="/dashboard"
            className="group relative overflow-hidden rounded-[26px] border border-cyan-400/25 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-950/80 p-4 transition duration-300 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[14.5px] bg-slate-950">
                  <Radio className="h-5 w-5 text-cyan-300 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                    SIGNAL ROOM
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <h1 className="font-serif text-lg font-bold text-white tracking-tight">QA Intelligence</h1>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-300/90 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Engine v2.0.0
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                Active QA
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 px-3">
            Core Operations
          </div>
          <nav className="mt-2 space-y-1">
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]"
                      : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-xl transition duration-200",
                          isActive
                            ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25"
                            : "bg-white/[0.05] text-slate-300 group-hover:bg-white/[0.09] group-hover:text-cyan-200",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={cn(isActive ? "font-semibold text-white" : "text-slate-300")}>
                        {label}
                      </span>
                    </div>
                    {badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-mono transition",
                          isActive
                            ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"
                            : "bg-white/5 text-slate-400 border border-white/5 group-hover:text-slate-300",
                        )}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Card */}
          <div className="mt-auto rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-3.5 backdrop-blur-lg shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-xs font-bold text-slate-950 shadow-md">
                QA
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user?.name ?? "QA Specialist"}</p>
                <p className="truncate text-xs text-cyan-300/80 font-medium">{user?.email ?? "qa@demo.local"}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 min-w-0">
          {/* Header Bar */}
          <header
            className={cn(
              "app-surface sticky top-4 z-30 mb-6 flex flex-col gap-4 overflow-visible rounded-[28px] border border-white/[0.08] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between shadow-lg",
              isScrolling && "shadow-[0_16px_40px_rgba(0,0,0,0.45)]",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 font-semibold">
                    Control Center
                  </span>
                  <span className="rounded-full bg-cyan-400/10 border border-cyan-400/25 px-2 py-0.2 text-[10px] font-mono text-cyan-200">
                    Ckret v2.0.0
                  </span>
                </div>
                <h2 className="mt-0.5 font-serif text-2xl text-white tracking-tight">
                  Defect Tracking & Test Intelligence
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/test-cases")}
                className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Search className="h-3.5 w-3.5 text-cyan-300" />
                <span>Search cases...</span>
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] p-2.5 text-slate-200 transition hover:bg-white/[0.08] hover:text-cyan-200"
              >
                {theme === "dark" ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={clearSession}
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20 shadow-sm shadow-rose-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
