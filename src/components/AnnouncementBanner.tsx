"use client";

import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
}

const TYPE_STYLES: Record<string, string> = {
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-500 text-gray-900",
  error: "bg-red-600 text-white",
  success: "bg-emerald-600 text-white",
};

const TYPE_ICONS: Record<string, any> = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dismissed_announcements") || "[]");
    setDismissed(stored);

    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data ?? []));
  }, []);

  const dismiss = (id: string) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem("dismissed_announcements", JSON.stringify(updated));
  };

  const visible = announcements.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5">
      {visible.map((a) => {
        const Icon = TYPE_ICONS[a.type] ?? Info;
        return (
          <div key={a.id} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${TYPE_STYLES[a.type]}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{a.title}:</span>
            <span className="flex-1">{a.message}</span>
            <button onClick={() => dismiss(a.id)} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}