"use client";

import { useState } from "react";
import AuditLogTable from "@/components/admin/AuditLogTable";
import { Users, FolderKanban, Building2, Terminal } from "lucide-react";

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
    <div className="mt-4 bg-white/50 backdrop-blur-xl border border-sky-200 shadow-2xl shadow-sky-200 p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-2xl w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider break-words truncate">
            Sistem Denetim Kayıtları
          </h2>
        </div>

        <div className="w-full lg:w-auto  no-scrollbar scroll-smooth -mx-4 px-2 md:px-4 sm:mx-0 sm:px-0">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 shadow-inner  lg:w-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/30"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto border border-slate-100 bg-white/40 w-full no-scrollbar">
        <div className="min-w-full inline-block align-middle">
          <AuditLogTable logs={logsMap[activeTab]} />
        </div>
      </div>
    </div>
  );
}