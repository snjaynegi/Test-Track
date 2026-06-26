import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyPlus, Paperclip } from "lucide-react";
import type { BugRecord, EvidenceAsset, ModuleNode, Project, User } from "../../shared/demo-data";

const bugSchema = z.object({
  title: z.string().min(5, "Title is required."),
  description: z.string().min(10, "Description is required."),
  projectId: z.string().min(1, "Project is required."),
  moduleId: z.string().min(1, "Module is required."),
  type: z.string().min(1, "Bug type is required."),
  severity: z.string().min(1, "Severity is required."),
  priority: z.string().min(1, "Priority is required."),
  environment: z.string().min(3, "Environment is required."),
  stepsToReproduce: z.string().min(10, "Steps are required."),
  expectedResult: z.string().min(5, "Expected result is required."),
  actualResult: z.string().min(5, "Actual result is required."),
  assignedUserId: z.string().min(1, "Assignee is required."),
});

type BugFormValues = z.infer<typeof bugSchema>;

interface BugComposerProps {
  user: User;
  projects: Project[];
  modules: ModuleNode[];
  assignees: User[];
  existingBugs: BugRecord[];
  onCreateBug: (bug: BugRecord, assets: EvidenceAsset[], duplicate: boolean) => void;
}

export function BugComposer({ user, projects, modules, assignees, existingBugs, onCreateBug }: BugComposerProps) {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      moduleId: modules[0]?.id ?? "",
      type: "FUNCTIONAL",
      severity: "MEDIUM",
      priority: "MEDIUM",
      assignedUserId: assignees[0]?.id ?? "",
    },
  });

  const selectedProjectId = watch("projectId");
  const filteredModules = useMemo(
    () => modules.filter((moduleNode) => moduleNode.projectId === selectedProjectId),
    [modules, selectedProjectId],
  );

  const onSubmit = (values: BugFormValues) => {
    const duplicate = existingBugs.some(
      (bug) =>
        bug.projectId === values.projectId &&
        bug.environment.toLowerCase() === values.environment.toLowerCase() &&
        bug.title.toLowerCase() === values.title.toLowerCase(),
    );

    const bugId = `local-${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    const newBug: BugRecord = {
      id: bugId,
      title: values.title,
      description: values.description,
      projectId: values.projectId,
      moduleId: values.moduleId,
      type: values.type as BugRecord["type"],
      severity: values.severity as BugRecord["severity"],
      priority: values.priority as BugRecord["priority"],
      environment: values.environment,
      stepsToReproduce: values.stepsToReproduce,
      expectedResult: values.expectedResult,
      actualResult: values.actualResult,
      reporterId: user.id,
      assignedUserId: values.assignedUserId,
      status: "OPEN",
      createdAt,
      updatedAt: createdAt,
    };

    const assets: EvidenceAsset[] = [...screenshots, ...videos].map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `${bugId}-asset-${index + 1}`,
        bugId,
        kind: file.type.startsWith("video/") ? "VIDEO" : "SCREENSHOT",
        fileName: file.name,
        shareUrl: previewUrl,
        previewUrl,
      };
    });

    onCreateBug(newBug, assets, duplicate);
    reset();
    setScreenshots([]);
    setVideos([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <FormField label="Bug Title" error={errors.title?.message}>
        <input {...register("title")} className="form-input" placeholder="Checkout freezes after CVV entry" />
      </FormField>
      <FormField label="Environment" error={errors.environment?.message}>
        <input {...register("environment")} className="form-input" placeholder="Chrome 136 / Windows" />
      </FormField>
      <FormField label="Project" error={errors.projectId?.message}>
        <select {...register("projectId")} className="form-input">
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Module" error={errors.moduleId?.message}>
        <select {...register("moduleId")} className="form-input">
          {filteredModules.map((moduleNode) => (
            <option key={moduleNode.id} value={moduleNode.id}>{moduleNode.name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Bug Type" error={errors.type?.message}>
        <select {...register("type")} className="form-input">
          {["FUNCTIONAL", "SECURITY", "UI_UX", "RESPONSIVE", "PERFORMANCE", "COMPATIBILITY", "ACCESSIBILITY", "INTEGRATION", "DATA_VALIDATION", "OTHER"].map((option) => (
            <option key={option} value={option}>{option.replace(/_/g, " ")}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Assigned User" error={errors.assignedUserId?.message}>
        <select {...register("assignedUserId")} className="form-input">
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Severity" error={errors.severity?.message}>
        <select {...register("severity")} className="form-input">
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Priority" error={errors.priority?.message}>
        <select {...register("priority")} className="form-input">
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Description" error={errors.description?.message} className="md:col-span-2">
        <textarea {...register("description")} className="form-input min-h-24" placeholder="Describe the issue and business impact." />
      </FormField>
      <FormField label="Steps to Reproduce" error={errors.stepsToReproduce?.message}>
        <textarea {...register("stepsToReproduce")} className="form-input min-h-28" placeholder="1. Open module..." />
      </FormField>
      <FormField label="Expected Result" error={errors.expectedResult?.message}>
        <textarea {...register("expectedResult")} className="form-input min-h-28" placeholder="Describe the intended behavior." />
      </FormField>
      <FormField label="Actual Result" error={errors.actualResult?.message} className="md:col-span-2">
        <textarea {...register("actualResult")} className="form-input min-h-24" placeholder="Describe the actual behavior observed." />
      </FormField>
      <FormField label="Screenshots" className="md:col-span-1">
        <label className="form-input flex cursor-pointer items-center justify-between">
          <span className="text-slate-300">{screenshots.length ? `${screenshots.length} selected` : "Upload screenshots"}</span>
          <Paperclip className="h-4 w-4 text-cyan-200" />
          <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => setScreenshots(Array.from(event.target.files ?? []))} />
        </label>
      </FormField>
      <FormField label="Videos" className="md:col-span-1">
        <label className="form-input flex cursor-pointer items-center justify-between">
          <span className="text-slate-300">{videos.length ? `${videos.length} selected` : "Upload bug demo video"}</span>
          <CopyPlus className="h-4 w-4 text-amber-200" />
          <input type="file" accept="video/*" multiple className="hidden" onChange={(event) => setVideos(Array.from(event.target.files ?? []))} />
        </label>
      </FormField>
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
          Save Bug Record
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
