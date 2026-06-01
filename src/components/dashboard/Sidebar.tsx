"use client"
import { Building2, CheckSquare, FolderOpen, LayoutDashboard, Road, Settings, Vault } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {label: "Dashboard", href: "/dashboard", icon: LayoutDashboard},
    {label: "Görevler", href: "/dashboard/tasks", icon: CheckSquare},
    {label: "Projects", href: "/dashboard/projects", icon: FolderOpen},
    {label: "Organizations", href: "/dashboard/organizations", icon: Building2},
    {label: "Support", href: "/dashboard/support", icon: Building2},
    {label: "İş Çizelgesi", href: "/dashboard/roadmap", icon: Road},
    {label: "Kaynaklar", href: "/dashboard/vault", icon: Vault},
    {label: "Settings", href: "/dashboard/settings", icon: Settings},
]


interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname();

    return (

        <aside className={`w-64 bg-purple-950/15  border border-white/10 rounded-b-xl shadow-xl shadow-[#dbc9e4] mx-4 border-gray-200 flex flex-col 
          transition-all duration-500 ease-in-out overflow-hidden
          ${isOpen ? " h-[480px] opacity-100 py-6 rounded-b-2xl" : "max-h-0 opacity-0 py-0 pointer-events-none"}`}
        >
            <Image src="/workmıx_logo.png" alt="WorkMix Logo" width={200} height={160} className="mx-auto " />
            
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname == item.href;
                    const Icon = item.icon;

                    return(
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-md font-medium transition-colors
                            ${isActive ? "bg-purple-50/20 backdrop-blur-2xl text-white" : "text-[#bb73d5] hover:bg-gray-100"}`}
                        >
                            <Icon size={18}/> {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}