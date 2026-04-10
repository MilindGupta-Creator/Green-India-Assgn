import { http, HttpResponse, delay } from "msw";
import { users, passwords, projects, tasks, generateId } from "./data";

const FAKE_TOKEN = "mock-jwt-token-taskflow";

function authorize(request: Request) {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  if (token !== FAKE_TOKEN) return null;
  return users[0]; // simplified: token always maps to first user
}

export const handlers = [
  // ── Auth ──────────────────────────────────────────────

  http.post("/auth/register", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, string>;
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return HttpResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return HttpResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (users.find((u) => u.email === email)) {
      return HttpResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const user = { id: generateId(), name, email };
    users.push(user);
    passwords[email] = password;

    return HttpResponse.json({ token: FAKE_TOKEN, user }, { status: 201 });
  }),

  http.post("/auth/login", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, string>;
    const { email, password } = body;

    if (!email || !password) {
      return HttpResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = users.find((u) => u.email === email);
    if (!user || passwords[email] !== password) {
      return HttpResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return HttpResponse.json({ token: FAKE_TOKEN, user }, { status: 200 });
  }),

  // ── Projects ──────────────────────────────────────────

  http.get("/projects", async ({ request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(projects);
  }),

  http.post("/projects", async ({ request }) => {
    await delay(200);
    const user = authorize(request);
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, string>;
    if (!body.name) {
      return HttpResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = {
      id: generateId(),
      name: body.name,
      description: body.description || "",
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(project);
    return HttpResponse.json(project, { status: 201 });
  }),

  http.get("/projects/:id", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectTasks = tasks.filter((t) => t.projectId === params.id);
    return HttpResponse.json({ ...project, tasks: projectTasks });
  }),

  http.patch("/projects/:id", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, string>;
    if (body.name !== undefined) project.name = body.name;
    if (body.description !== undefined) project.description = body.description;
    project.updatedAt = new Date().toISOString();

    return HttpResponse.json(project);
  }),

  http.delete("/projects/:id", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idx = projects.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects.splice(idx, 1);
    // also remove associated tasks
    const taskIds = tasks.filter((t) => t.projectId === params.id).map((t) => t.id);
    taskIds.forEach((id) => {
      const ti = tasks.findIndex((t) => t.id === id);
      if (ti !== -1) tasks.splice(ti, 1);
    });

    return new HttpResponse(null, { status: 204 });
  }),

  // ── Tasks ─────────────────────────────────────────────

  http.get("/projects/:id/tasks", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");
    const assigneeFilter = url.searchParams.get("assignee");

    let filtered = tasks.filter((t) => t.projectId === params.id);
    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);
    if (assigneeFilter) filtered = filtered.filter((t) => t.assignee === assigneeFilter);

    return HttpResponse.json({ tasks: filtered });
  }),

  http.post("/projects/:id/tasks", async ({ params, request }) => {
    await delay(200);
    const user = authorize(request);
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, string>;
    if (!body.title) {
      return HttpResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const task = {
      id: generateId(),
      title: body.title,
      description: body.description || "",
      status: (body.status || "todo") as "todo" | "in_progress" | "done",
      priority: (body.priority || "medium") as "low" | "medium" | "high",
      assignee: body.assignee || undefined,
      dueDate: body.dueDate || undefined,
      projectId: params.id as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch("/tasks/:id", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = tasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, string>;
    if (body.title !== undefined) task.title = body.title;
    if (body.description !== undefined) task.description = body.description;
    if (body.status !== undefined) task.status = body.status as "todo" | "in_progress" | "done";
    if (body.priority !== undefined) task.priority = body.priority as "low" | "medium" | "high";
    if (body.assignee !== undefined) task.assignee = body.assignee;
    if (body.dueDate !== undefined) task.dueDate = body.dueDate;
    task.updatedAt = new Date().toISOString();

    return HttpResponse.json(task);
  }),

  http.delete("/tasks/:id", async ({ params, request }) => {
    await delay(200);
    if (!authorize(request)) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idx = tasks.findIndex((t) => t.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ error: "Task not found" }, { status: 404 });
    }

    tasks.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
