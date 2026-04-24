import Navbar from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll() { },
            },
        }
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar user={user} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>


            </div>
        </div>
    )
}
