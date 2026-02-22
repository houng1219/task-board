import { NextRequest, NextResponse } from "next/server";
import { KvRestClient } from "@upstash/redis";

const kv = new KvRestClient({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

const TASKS_KEY = "tasks";

export async function GET() {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }
  
  try {
    const tasks = await kv.get<any[]>(TASKS_KEY);
    return NextResponse.json(tasks || []);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }
  
  const { title, assignee } = await req.json();
  const now = Date.now();
  const task = {
    id: `task-${now}`,
    title,
    status: "todo",
    assignee,
    createdAt: now,
    updatedAt: now,
  };

  const tasks = (await kv.get<any[]>(TASKS_KEY)) || [];
  tasks.push(task);
  await kv.set(TASKS_KEY, tasks);

  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }
  
  const { id, status, assignee } = await req.json();
  const tasks = (await kv.get<any[]>(TASKS_KEY)) || [];
  const index = tasks.findIndex((t: any) => t.id === id);
  
  if (index !== -1) {
    if (status) tasks[index].status = status;
    if (assignee) tasks[index].assignee = assignee;
    tasks[index].updatedAt = Date.now();
    await kv.set(TASKS_KEY, tasks);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }
  
  const { id } = await req.json();
  const tasks = (await kv.get<any[]>(TASKS_KEY)) || [];
  const filtered = tasks.filter((t: any) => t.id !== id);
  await kv.set(TASKS_KEY, filtered);

  return NextResponse.json({ ok: true });
}
