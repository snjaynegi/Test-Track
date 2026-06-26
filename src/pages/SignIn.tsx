import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DatabaseZap, Moon, Shield, Sun } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { useTheme } from "@/hooks/useTheme";

const demoUsers = [
  { label: "Reporting Manager", email: "manager@demo.local" },
  { label: "QA User", email: "qa@demo.local" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const { setSession } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to sign in.");
      }

      setSession({
        user: payload.data.user,
        token: payload.data.token,
      });
      navigate("/dashboard");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-page-bg min-h-screen px-4 py-8">
      <div className="mx-auto flex min-h-[92vh] max-w-xl items-center justify-center">
        <section className="app-surface w-full rounded-[36px] border p-8 shadow-[0_24px_100px_rgba(15,23,42,0.25)] backdrop-blur lg:p-10">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
          <p className="text-center text-xs uppercase tracking-[0.35em] text-cyan-200/70">QA Operations Console</p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-100">
              <Shield className="h-4 w-4" />
              Authentication Pending
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="font-serif text-4xl text-white">Sign in</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
              Use a demo Reporting Manager or QA account to explore the application while projects, bugs, and reports remain empty.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => setEmail(user.email)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                {user.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <input className="form-input" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Password</span>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-70"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="flex items-center gap-3 text-cyan-100">
              <DatabaseZap className="h-5 w-5" />
              <p className="font-medium text-white">Demo credentials</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Use `manager@demo.local` or `qa@demo.local` with password `demo123`.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
