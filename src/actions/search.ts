"use server";

import { createClient } from "@/lib/supabase/server";

export type SearchResults = {
  projects: { id: string; name: string; description: string | null; status: string }[];
  tasks: { id: string; title: string; status: string; priority: string; project_id: string }[];
  users: { id: string; name: string; email: string; avatar_url: string | null; job_title: string | null }[];
  organizations: { id: string; name: string }[]; // Organizasyonlar eklendi
};

export async function globalSearch(query: string): Promise<SearchResults> {
  const EMPTY: SearchResults = { projects: [], tasks: [], users: [], organizations: [] };

  if (!query || !query.trim() || query.trim().length < 2) {
    return EMPTY;
  }

  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return EMPTY;

    const q = `%${query.trim()}%`;

    const { data: matchedOrgs } = await supabase
      .from("organizations")
      .select("id, name")
      .ilike("name", q)
      .limit(5);

    const { data: userProjects } = await supabase
      .from("projects")
      .select("id, name, description, status, org_id")
      .eq("created_by", user.id);

    const orgIds = Array.from(new Set(userProjects?.map((p) => p.org_id).filter(Boolean) || []));

    let projectsQuery = supabase.from("projects").select("id, name, description, status");

    if (orgIds.length > 0) {
      projectsQuery = projectsQuery.or(`org_id.in.(${orgIds.map(id => `"${id}"`).join(",")}),created_by.eq.${user.id}`);
    } else {
      projectsQuery = projectsQuery.eq("created_by", user.id);
    }

    const { data: allProjects } = await projectsQuery;
    const projectIds = allProjects?.map((p) => p.id) || [];

    const matchedProjects = allProjects
      ? allProjects
          .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
          .slice(0, 5)
      : [];

    let matchedTasks: any[] = [];
    if (projectIds.length > 0) {
      const { data: tasksRes } = await supabase
        .from("tasks")
        .select("id, title, status, priority, project_id")
        .in("project_id", projectIds)
        .ilike("title", q)
        .limit(5);

      if (tasksRes) {
        matchedTasks = tasksRes;
      }
    }

    const { data: usersRes } = await supabase
      .from("users")
      .select("id, name, email, avatar_url, job_title")
      .or(`name.ilike.${q},email.ilike.${q}`)
      .limit(5);

    return {
      projects: matchedProjects,
      tasks: matchedTasks ?? [],
      users: usersRes ?? [],
      organizations: matchedOrgs ?? [], 
    };

  } catch (error) {
    console.error("Global search catch error:", error);
    return EMPTY;
  }
}