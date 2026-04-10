import api from "./api";
import type { Project, ProjectWithTasks } from "@/types";

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>("/projects");
  return data;
}

export async function getProject(id: string): Promise<ProjectWithTasks> {
  const { data } = await api.get<ProjectWithTasks>(`/projects/${id}`);
  return data;
}

export async function createProject(name: string, description: string): Promise<Project> {
  const { data } = await api.post<Project>("/projects", { name, description });
  return data;
}

export async function updateProject(id: string, updates: Partial<Pick<Project, "name" | "description">>): Promise<Project> {
  const { data } = await api.patch<Project>(`/projects/${id}`, updates);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
