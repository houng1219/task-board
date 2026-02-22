"use client";

import { useState, useEffect, useTransition } from "react";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "me" | "ai";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: Assignee;
  createdAt: number;
  updatedAt: number;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo", label: "📋 To Do", color: "bg-gray-100" },
  { status: "in_progress", label: "🔄 In Progress", color: "bg-blue-100" },
  { status: "review", label: "👀 Review", color: "bg-yellow-100" },
  { status: "done", label: "✅ Done", color: "bg-green-100" },
];

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) return [];
  return res.json();
}

async function createTaskApi(title: string, assignee: Assignee): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title, assignee }),
  });
  return res.json();
}

async function updateTaskApi(
  id: string,
  updates: { status?: TaskStatus; assignee?: Assignee }
): Promise<void> {
  await fetch("/api/tasks", {
    method: "PATCH",
    body: JSON.stringify({ id, ...updates }),
  });
}

async function deleteTaskApi(id: string): Promise<void> {
  await fetch("/api/tasks", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<Assignee>("me");
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadTasks = () => {
    startTransition(async () => {
      const data = await fetchTasks();
      setTasks(data);
      setLoaded(true);
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task = await createTaskApi(newTaskTitle, newTaskAssignee);
    setTasks([...tasks, task]);
    setNewTaskTitle("");
  };

  const updateStatus = async (id: string, status: TaskStatus) => {
    await updateTaskApi(id, { status });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status, updatedAt: Date.now() } : t)));
  };

  const updateAssignee = async (id: string, assignee: Assignee) => {
    await updateTaskApi(id, { assignee });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, assignee } : t)));
  };

  const deleteTask = async (id: string) => {
    await deleteTaskApi(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  if (!loaded) return <div className="p-8">載入中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🎯 任務看板 Task Board ☁️
        </h1>

        <form onSubmit={handleCreateTask} className="bg-white p-4 rounded-lg shadow mb-8 flex gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="新任務標題..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value as Assignee)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="me">👤 我</option>
            <option value="ai">🤖 AI</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            新增
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.status} className={`${col.color} rounded-lg p-4 min-h-[400px]`}>
              <h2 className="font-semibold text-gray-700 mb-4 flex justify-between">
                {col.label}
                <span className="bg-white px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus(col.status).length}
                </span>
              </h2>
              <div className="space-y-3">
                {getTasksByStatus(col.status).map((task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{task.title}</span>
                      <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                        ×
                      </button>
                    </div>
                    <select
                      value={task.assignee}
                      onChange={(e) => updateAssignee(task.id, e.target.value as Assignee)}
                      className="text-xs px-2 py-1 border rounded mb-2"
                    >
                      <option value="me">👤 我</option>
                      <option value="ai">🤖 AI</option>
                    </select>
                    <div className="flex flex-wrap gap-1">
                      {columns.filter((c) => c.status !== task.status).map((c) => (
                        <button
                          key={c.status}
                          onClick={() => updateStatus(task.id, c.status)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          → {c.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
