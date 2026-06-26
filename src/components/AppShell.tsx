import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { BarChart3, Bug, FileSpreadsheet, FolderKanban, LayoutDashboard, LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/hooks/useAppStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/bugs", label: "Bug Management", icon: Bug },
  { to: "/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/users", label: "User Management", icon: ShieldCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, clearSession } = useAppStore();
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
    <div className="app-shell-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside
          className={cn(
            "app-surface sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col overflow-y-auto rounded-[32px] border p-6 backdrop-blur lg:flex",
            isScrolling && "shadow-[0_18px_48px_rgba(15,23,42,0.12)]",
          )}
        >
          <Link to="/dashboard" className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Bug Tracking Suite</p>
            <h1 className="mt-3 font-serif text-3xl text-white">Signal Room</h1>
            <p className="mt-2 text-sm text-slate-300">Role-based QA tracking, evidence management, and polished executive reporting.</p>
          </Link>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
                    isActive && "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed In As</p>
            <p className="mt-3 font-medium text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.role === "REPORTING_MANAGER" ? "Reporting Manager" : "QA User"}</p>
          </div>
        </aside>

        <main className="flex-1">
          <header
            className={cn(
              "app-surface sticky top-4 z-30 mb-6 flex flex-col gap-4 overflow-visible rounded-[28px] border p-4 backdrop-blur md:flex-row md:items-center md:justify-between",
              "relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-6 after:h-6 after:rounded-b-[28px] after:backdrop-blur-xl after:bg-[color:var(--app-panel-soft)] after:content-['']",
              isScrolling && "shadow-[0_12px_40px_rgba(15,23,42,0.15)]",
            )}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Operational Control Center</p>
              <h2 className="mt-2 font-serif text-3xl text-white">Track defects, evidence, and QA momentum.</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button
                type="button"
                onClick={clearSession}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-400/20"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </header>

          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
