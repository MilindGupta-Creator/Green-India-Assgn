import api from "./api";
import type { Task } from "@/types";

interface TaskFilters {
  status?: string;
  assignee?: string;
}

export async function getTasks(projectId: string, filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.assignee) params.set("assignee", filters.assignee);
  const { data } = await api.get<{ tasks: Task[] }>(`/projects/${projectId}/tasks`, { params });
  return data.tasks;
}

export async function createTask(projectId: string, task: Pick<Task, "title" | "status" | "priority"> & Partial<Task>): Promise<Task> {
  const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, task);
  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${taskId}`, updates);
  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
