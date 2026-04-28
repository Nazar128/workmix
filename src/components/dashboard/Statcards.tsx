import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3">{description}</p>
    </div>
  );
}