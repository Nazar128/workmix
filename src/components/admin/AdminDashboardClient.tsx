"use client";

import { useState } from "react";
import AuditLogTable from "@/components/admin/AuditLogTable";
import { Users, FolderKanban, Building2 } from "lucide-react";

const TABS = [
  { key: "user",         label: "Kullanıcı İşlemleri",    icon: Users },
  { key: "project",      label: "Proje İşlemleri",        icon: FolderKanban },
  { key: "organization", label: "Organizasyon İşlemleri", icon: Building2 },
];

interface Props {
  userLogs: any[];
  projectLogs: any[];
  orgLogs: any[];
}

export default function AdminDashboardClient({ userLogs, projectLogs, orgLogs }: Props) {
  const [activeTab, setActiveTab] = useState("user");

  const logsMap: Record<string, any[]> = {
    user: userLogs,
    project: projectLogs,
    organization: orgLogs,
  };

  return (
    <div className="px-6 pb-6">
      <h2 className="text-xl text-gray-100 font-bold uppercase tracking-tight mb-4">
        Denetim Kayıtları
      </h2>

      <div className="flex gap-2 mb-4 border-b border-gray-800">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AuditLogTable logs={logsMap[activeTab]} />
    </div>
  );
}