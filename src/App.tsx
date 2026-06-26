import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import Empty from "@/components/Empty";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useAppStore } from "@/hooks/useAppStore";
import Analytics from "@/pages/Analytics";
import Bugs from "@/pages/Bugs";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Reports from "@/pages/Reports";
import SignIn from "@/pages/SignIn";
import Users from "@/pages/Users";

export default function App() {
  const { user } = useAppStore();
  const { data, isLoading, error } = useBootstrap(user?.id);

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<SignIn />} />
        </Routes>
      ) : (
        <AppShell>
          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">{error}</div>
          ) : !data ? (
            <Empty />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard data={data} />} />
              <Route path="/projects" element={<Projects data={data} />} />
              <Route path="/bugs" element={<Bugs data={data} />} />
              <Route path="/reports" element={<Reports data={data} />} />
              <Route path="/analytics" element={<Analytics data={data} />} />
              <Route path="/users" element={<Users data={data} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </AppShell>
      )}
    </BrowserRouter>
  );
}
