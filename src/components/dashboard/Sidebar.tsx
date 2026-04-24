"use client"
import { Building2, CheckSquare, FolderOpen, Icon, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {label: "Dashboard", href: "/dashboard", icon: LayoutDashboard},
    {label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare},
    {label: "Projects", href: "/dashboard/projects", icon: FolderOpen},
    {label: "Organizations", href: "/dashboard/organizations", icon: Building2},
    {label: "Settings", href: "/dashboard/settings", icon: Settings},
]

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-gray-200 flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="text-3xl font-bold  text-indigo-600">WorkMix</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 ">
                {menuItems.map((item) => {
                    const isActive = pathname == item.href;
                    const Icon = item.icon;

                    return(
                        <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-md font-medium transition-colors
                        ${isActive ? "bg-indigo-500 " : "text-gray-600 hover: bg-gray-100 "}`}><Icon size={18}/> {item.label}</Link>
                    )

                })}
            </nav>


        </aside>
    )
}