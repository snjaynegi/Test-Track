import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../shared/demo-data";

interface AppStore {
  user: User | null;
  token: string | null;
  activeProjectId: string | null;
  setSession: (payload: { user: User; token: string }) => void;
  clearSession: () => void;
  setActiveProjectId: (projectId: string | null) => void;
  addProjectId: (projectId: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeProjectId: null,
      setSession: ({ user, token }) =>
        set({
          user,
          token,
          activeProjectId: user.projectIds[0] ?? null,
        }),
      clearSession: () =>
        set({
          user: null,
          token: null,
          activeProjectId: null,
        }),
      setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
      addProjectId: (projectId) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          const nextProjectIds = state.user.projectIds.includes(projectId)
            ? state.user.projectIds
            : [...state.user.projectIds, projectId];
          return {
            ...state,
            user: {
              ...state.user,
              projectIds: nextProjectIds,
            },
            activeProjectId: projectId,
          };
        }),
    }),
    {
      name: "bug-tracking-session",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        activeProjectId: state.activeProjectId,
      }),
    },
  ),
);
