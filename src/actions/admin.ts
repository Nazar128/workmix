"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMembers(organizationId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkisiz erişim");

  const { data, error } = await supabase.rpc("get_organization_members_by_admin", {
    org_id: organizationId
  });

  if (error) {
    console.error("Üyeler listelenirken hata oluştu:", error.message);
    throw new Error(error.message);
  }

  return data || [];
}