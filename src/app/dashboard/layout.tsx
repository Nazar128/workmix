
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Metadata } from "next";


export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

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
        setAll() {},
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  let profile = null;
  if (authUser) {
    const { data } = await supabase .from("users").select("*").eq("id", authUser.id).single();
    profile = data;
  }

  return (
    <DashboardShell user={profile}>
      {children}
    </DashboardShell>
  );
}