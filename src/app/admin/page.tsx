import { getAuditLogs } from '@/actions/admin';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import Dashboard from '@/components/admin/Dashboard';


export default async function AdminPage() {
  const [userLogs, projectLogs, orgLogs] = await Promise.all([
    getAuditLogs("users", 10),
    getAuditLogs("projects", 10),
    getAuditLogs("organizations", 10),
  ]);

  return (
    <div className="flex flex-col">
      <Dashboard />
      <AdminDashboardClient
        userLogs={userLogs}
        projectLogs={projectLogs}
        orgLogs={orgLogs}
      />
    </div>
  );
}