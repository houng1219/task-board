"use client";

import { useState, useEffect } from "react";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "me" | "ai";

interface Task {
  id: string;
  title: string;
  description?: string;
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

const STORAGE_KEY = "task-board-tasks";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<Assignee>("me");
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const createTask = (title: string, assignee: Assignee) => {
    const now = Date.now();
    const newTask: Task = {
      id: `task-${now}`,
      title,
      status: "todo",
      assignee,
      createdAt: now,
      updatedAt: now,
    };
    setTasks([...tasks, newTask]);
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: Date.now() } : t
      )
    );
  };

  const updateAssignee = (id: string, assignee: Assignee) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, assignee, updatedAt: Date.now() } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask(newTaskTitle, newTaskAssignee);
    setNewTaskTitle("");
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🎯 任務看板 Task Board
        </h1>

        {/* Add Task Form */}
        <form
          onSubmit={handleCreateTask}
          className="bg-white p-4 rounded-lg shadow mb-8 flex gap-4 items-center"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="新任務標題..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value as Assignee)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="me">👤 分配給我</option>
            <option value="ai">🤖 分配給 AI</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            新增
          </button>
        </form>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div
              key={column.status}
              className={`${column.color} rounded-lg p-4 min-h-[400px]`}
            >
              <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                {column.label}
                <span className="bg-white px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus(column.status).length}
                </span>
              </h2>

              <div className="space-y-3">
                {getTasksByStatus(column.status).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>

                    {/* Assignee */}
                    <div className="mb-3">
                      <select
                        value={task.assignee}
                        onChange={(e) =>
                          updateAssignee(task.id, e.target.value as Assignee)
                        }
                        className="text-xs px-2 py-1 border rounded bg-gray-50"
                      >
                        <option value="me">👤 我</option>
                        <option value="ai">🤖 AI</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div className="flex gap-1 flex-wrap">
                      {columns
                        .filter((c) => c.status !== task.status)
                        .map((column) => (
                          <button
                            key={column.status}
                            onClick={() => updateStatus(task.id, column.status)}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                          >
                            → {column.label.split(" ")[0]}
                          </button>
                        ))}
                    </div>

                    <div className="text-xs text-gray-400 mt-3">
                      更新於 {new Date(task.updatedAt).toLocaleString("zh-TW")}
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
