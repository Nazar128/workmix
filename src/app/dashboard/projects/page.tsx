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

  let query = supabase
    .from("projects")
    .select("*, organizations!org_id(name)")
    .eq("created_by", user.id);

  if (resolvedSearchParams.q && typeof resolvedSearchParams.q === "string") {
    query = query.ilike("name", `%${resolvedSearchParams.q}%`);
  }
  if (resolvedSearchParams.status && typeof resolvedSearchParams.status === "string") {
    query = query.eq("status", resolvedSearchParams.status);
  }
  if (resolvedSearchParams.visibility && typeof resolvedSearchParams.visibility === "string") {
    query = query.eq("visibility", resolvedSearchParams.visibility);
  }

  const [projectsRes, organizationRes] = await Promise.all([
    query,
    supabase
      .from("organizations")
      .select("id, name")
      .eq("status", "active"),
  ]);

  return (
    <ProjectsView 
      initialProjects={projectsRes.data || []} 
      organizations={organizationRes.data || []} 
    />
  );
}