import { createClient } from "@/lib/supabase/server";

type AuditAction =
  | "user.created"
  | "user.suspended"
  | "user.activated"
  | "user.role_changed"
  | "project.created"
  | "project.deleted"
  | "org.suspended"
  | "org.activated"
  | "org.limits_updated"
  | "org.ownership_transferred"
  | "announcement.created"
  | "announcement.deleted"
  | "announcement.toggled";

interface AuditParams {
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  org_id?: string;
  old_value?: object;
  new_value?: object;
  ip_address?: string;
}

export async function logAudit(params: AuditParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("audit_logs").insert({
      user_id: user?.id ?? null,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id ?? null,
      new_value: params.new_value ?? null,
    });

    if (error) {
      console.error("AUDIT LOG INSERT HATASI:", error.message); 
    }
  } catch (e) {
    console.error("Audit log sistem hatası:", e);
  }
}