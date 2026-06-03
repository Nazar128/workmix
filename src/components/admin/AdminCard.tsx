import { LucideIcon } from 'lucide-react';
import React from 'react';

interface AdminCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description: string;
}

export default function AdminCard({ title, value, icon: Icon, description }: AdminCardProps) {
    return (
        <div className="group relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-1 md:p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden">
            <div className="absolute -right-6 -top-6 w-10 h-10 md:w-20 md:h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-125 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col gap-1 md:gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                        {title}
                    </span>
                    <div className="p-1 md:p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100/50 transition-all duration-300">
                        <Icon className="w-4 h-4" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-800 font-sans bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text">
                        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
                    </h3>
                    <p className="text-[11px] md:text-[13px] font-medium text-slate-400 mt-1 line-clamp-2 leading-normal">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}