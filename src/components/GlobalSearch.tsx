"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";

function getInitials(name: string) {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
const statusColors: Record<string, string> = {
    active: "text-green-400",
    completed: "text-blue-400",
    pending: "text-yellow-400",
    in_progress: "text-blue-400",
    todo: "text-gray-400",
    done: "text-green-400",
};
export default function GlobalSearch() {
    const { query, setQuery, results, loading, hasResults, clear } = useSearch();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)
            ) {
                clear();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [clear]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") clear();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [clear]);

    const navigate = (path: string) => {
        router.push(path);
        clear();
    };
    const showDropdown = query.length >= 2;
    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ara... (Ctrl+K)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-500 outline-none focus:border-blue-500/50 placeholder:text-gray-600 transition-colors"
                />
                {query && (
                    <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        ✕
                    </button>
                )}
            </div>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full mt-1 w-full bg-[#0f1115] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                    {loading && (
                        <div className="px-4 py-3 text-sm text-gray-500">Aranıyor...</div>
                    )}

                    {!loading && !hasResults && (
                        <div className="px-4 py-3 text-sm text-gray-500">Sonuç bulunamadı.</div>
                    )}

                    {results.organizations && results.organizations.length > 0 && (
                        <div>
                            <p className="px-3 pt-3 pb-1 text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Organizasyonlar</p>
                            {results.organizations.map((org) => (
                                <button
                                    key={org.id}
                                    onClick={() => navigate(`/dashboard/organizations/${org.id}`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{org.name}</p>
                                        <p className="text-xs text-gray-500">Çalışma Alanı / Kurum</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    {results.projects.length > 0 && (
                        <div>
                            <p className="px-3 pt-3 pb-1 text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Projeler</p>
                            {results.projects.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => navigate(`/dashboard/projects/${p.id}`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{p.name}</p>
                                        {p.description && <p className="text-xs text-gray-500 truncate">{p.description}</p>}
                                    </div>
                                    <span className={`text-xs ${statusColors[p.status] ?? "text-gray-400"}`}>{p.status}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {results.tasks.length > 0 && (
                        <div>
                            <p className="px-3 pt-3 pb-1 text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Görevler</p>
                            {results.tasks.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => navigate(`/dashboard/tasks/${t.id}`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{t.title}</p>
                                        <p className="text-xs text-gray-500">{t.priority} öncelik</p>
                                    </div>
                                    <span className={`text-xs ${statusColors[t.status] ?? "text-gray-400"}`}>{t.status}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {results.users.length > 0 && (
                        <div className="pb-2">
                            <p className="px-3 pt-3 pb-1 text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Ekip Üyeleri</p>
                            {results.users.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => navigate(`/dashboard/profile/${u.id}`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                                >
                                    {u.avatar_url ? (
                                        <img src={u.avatar_url} alt={u.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                                            {getInitials(u.name)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{u.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{u.job_title ?? u.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}