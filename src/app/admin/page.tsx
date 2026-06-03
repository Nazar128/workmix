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
    <div className="flex flex-col gap-4 py-8 px-0.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-screen">
      <Dashboard />
      <div className='h-0.5 bg-purple-300 opacity-60'></div>
      <AdminDashboardClient
        userLogs={userLogs}
        projectLogs={projectLogs}
        orgLogs={orgLogs}
      />
    </div>
  );
}