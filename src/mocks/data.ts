import type { User, Project, Task } from "@/types";

export const users: User[] = [
  { id: "u1", name: "Test User", email: "test@example.com" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com" },
];

export const passwords: Record<string, string> = {
  "test@example.com": "password123",
  "jane@example.com": "password123",
};

export let projects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Redesign the company website with modern UI",
    ownerId: "u1",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Build a cross-platform mobile application",
    ownerId: "u1",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "p3",
    name: "API Integration",
    description: "Integrate third-party payment and analytics APIs",
    ownerId: "u2",
    createdAt: "2025-03-10T10:00:00Z",
    updatedAt: "2025-03-10T10:00:00Z",
  },
];

export let tasks: Task[] = [
  {
    id: "t1",
    title: "Design homepage mockup",
    description: "Create wireframes and high-fidelity mockups for the new homepage",
    status: "done",
    priority: "high",
    assignee: "u1",
    dueDate: "2025-02-01",
    projectId: "p1",
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "t2",
    title: "Implement responsive nav",
    description: "Build a responsive navigation bar that works on mobile and desktop",
    status: "in_progress",
    priority: "high",
    assignee: "u1",
    dueDate: "2025-02-15",
    projectId: "p1",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
  },
  {
    id: "t3",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment pipeline",
    status: "todo",
    priority: "medium",
    assignee: "u2",
    dueDate: "2025-03-01",
    projectId: "p1",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "t4",
    title: "User authentication flow",
    description: "Implement login, registration, and password reset screens",
    status: "in_progress",
    priority: "high",
    assignee: "u1",
    dueDate: "2025-02-20",
    projectId: "p2",
    createdAt: "2025-02-02T10:00:00Z",
    updatedAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "t5",
    title: "Push notification setup",
    description: "Integrate push notifications for iOS and Android",
    status: "todo",
    priority: "low",
    assignee: "u2",
    dueDate: "2025-03-15",
    projectId: "p2",
    createdAt: "2025-02-05T10:00:00Z",
    updatedAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "t6",
    title: "Payment gateway integration",
    description: "Connect Stripe payment processing API",
    status: "todo",
    priority: "high",
    assignee: "u1",
    dueDate: "2025-04-01",
    projectId: "p3",
    createdAt: "2025-03-11T10:00:00Z",
    updatedAt: "2025-03-11T10:00:00Z",
  },
];

let nextId = 100;
export function generateId() {
  return `gen_${++nextId}`;
}
