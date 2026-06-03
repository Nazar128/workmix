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
        <div className="min-h-screen min-w-full dark:bg-black text-gray-600 ">
            <AdminNavbar />
            <main className="flex-1 py-12 min-h-screen">
                <div className="align-center justify-center px-0.5 sm:p-4 lg:px-8 max-w-7xl mx-auto w-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}