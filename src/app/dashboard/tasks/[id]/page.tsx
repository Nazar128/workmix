import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import createServer from "next/dist/server/next";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  
  const supabase = await createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: task, error } = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .eq("id", id)
    .single();

  if (error || !task) {
    notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/dashboard/tasks" className="text-gray-500 hover:text-purple-600 mb-4 inline-block">
        ← Görevlere Geri Dön
      </Link>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {task.status === 'done' ? 'Tamamlandı' : 'Devam Ediyor'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm text-gray-500 block">Proje</label>
            <p className="font-medium text-gray-800">{task.projects?.name || "Proje atanmamış"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block">Oluşturulma Tarihi</label>
            <p className="font-medium text-gray-800">
              {new Date(task.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 block mb-2">Açıklama</label>
          <div className="p-4 bg-gray-50 rounded-md text-gray-700 min-h-[100px]">
            {task.description || "Açıklama girilmemiş."}
          </div>
        </div>
      </div>
    </div>
  );
}