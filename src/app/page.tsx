import { KvRestClient } from "@upstash/redis";

const kv = new KvRestClient({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

const TASKS_KEY = "tasks";

export const runtime = "edge";

export default async function Home() {
  // Fetch tasks from KV on server
  let tasks: any[] = [];
  
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const result = await kv.get<any[]>(TASKS_KEY);
      tasks = result || [];
    } catch (e) {
      console.error("KV get error:", e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🎯 任務看板 Task Board
        </h1>
        
        {!process.env.KV_REST_API_URL && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            ⚠️ 請設置 KV_REST_API_URL 和 KV_REST_API_TOKEN 環境變數來啟用雲端同步
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { status: "todo", label: "📋 To Do", color: "bg-gray-100" },
            { status: "in_progress", label: "🔄 In Progress", color: "bg-blue-100" },
            { status: "review", label: "👀 Review", color: "bg-yellow-100" },
            { status: "done", label: "✅ Done", color: "bg-green-100" },
          ].map((col) => (
            <div key={col.status} className={`${col.color} rounded-lg p-4 min-h-[300px]`}>
              <h2 className="font-semibold text-gray-700 mb-4">
                {col.label} ({tasks.filter((t: any) => t.status === col.status).length})
              </h2>
              <p className="text-sm text-gray-500">載入中...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
