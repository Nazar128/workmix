import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import ProjectsView from '@/components/dashboard/ProjectsView';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userProfile } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const orgId = userProfile?.organization_id;

  let query = supabase
    .from("projects")
    .select("*, organizations!org_id(name)")
    .eq("organization_id", orgId)
    .order('created_at', { ascending: false });

  if (typeof resolvedSearchParams.q === "string") query = query.ilike("name", `%${resolvedSearchParams.q}%`);
  if (typeof resolvedSearchParams.status === "string") query = query.eq("status", resolvedSearchParams.status);
  if (typeof resolvedSearchParams.visibility === "string") query = query.eq("visibility", resolvedSearchParams.visibility);

  const [projectsRes, organizationRes] = await Promise.all([
    query,
    supabase
      .from("organizations")
      .select("id, name")
      .eq("id", orgId),
  ]);

  return (
    <ProjectsView 
      initialProjects={projectsRes.data || []} 
      organizations={organizationRes.data || []} 
    />
  );
}