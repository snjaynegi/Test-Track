import { useEffect, useState } from "react";
import type { BootstrapPayload } from "../../shared/demo-data";
import { LOCAL_WORKSPACE_EVENT, mergeWithLocalWorkspace } from "@/lib/localWorkspace";

interface BootstrapState {
  data: BootstrapPayload | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useBootstrap(userId?: string): BootstrapState {
  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!userId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bootstrap?userId=${userId}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to load workspace data.");
      }

      setData(mergeWithLocalWorkspace(payload.data));
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = () => {
      setData((current) => (current ? mergeWithLocalWorkspace(current) : current));
    };
    const storageHandler = (event: StorageEvent) => {
      if (event.key === "bug-tracking-local-workspace") {
        handler();
      }
    };

    window.addEventListener(LOCAL_WORKSPACE_EVENT, handler);
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener(LOCAL_WORKSPACE_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return { data, isLoading, error, refresh };
}
