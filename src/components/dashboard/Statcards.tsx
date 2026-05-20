import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/80 to-purple-50/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(147,51,234,0.08)]">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-400/10 blur-xl" />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-900/60">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-800 mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-md shadow-purple-500/20">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-purple-900/50 relative z-10 bg-purple-50/50 py-1.5 px-2.5 rounded-lg w-fit border border-purple-100/50">
        {description}
      </div>
    </div>
  );
}