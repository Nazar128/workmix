import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("users")
        .select("system_role")
        .eq("id", user.id)
        .single();

    if (profile?.system_role !== "super_admin") redirect("/");

    return (
        <div className="min-h-screen  text-gray-600 flex">
            <AdminNavbar />
            <main className="flex-1 pl-64 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}