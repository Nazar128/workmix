"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterOption {
  column: string;
  label: string;
  type: "select" | "text" | "boolean";
  options?: { label: string; value: string }[];
}

interface GlobalFilterProps {
  tableName: string;
  filterConfig: FilterOption[];
}

export default function GlobalFilter({ filterConfig }: GlobalFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        router.push(pathname + "?" + createQueryString("q", searchTerm));
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  const handleSelectChange = (column: string, value: string) => {
    router.push(pathname + "?" + createQueryString(column, value));
  };

  const clearFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex-1 min-w-[180px]">
        <input
          type="text"
          placeholder="Ara..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filterConfig.map((config) => (
        <div key={config.column} className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">{config.label}</label>
          <select
            className="text-sm border border-gray-300 rounded-md py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            value={searchParams.get(config.column) || ""}
            onChange={(e) => handleSelectChange(config.column, e.target.value)}
          >
            <option value="">Hepsi</option>
            {config.type === "boolean" ? (
              <>
                <option value="true">Evet</option>
                <option value="false">Hayır</option>
              </>
            ) : (
              config.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            )}
          </select>
        </div>
      ))}

      <button
        onClick={clearFilters}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium ml-auto"
      >
        Temizle
      </button>
    </div>
  );
}