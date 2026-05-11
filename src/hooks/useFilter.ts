import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useFilter = (tableName: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = useCallback((filters: Record<string, string | boolean | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const getFilteredQuery = (query: any) => {
    searchParams.forEach((value, key) => {
      if (key === "q") {
        query = query.or(`name.ilike.%${value}%,title.ilike.%${value}%,email.ilike.%${value}%`);
      } else if (value === "true" || value === "false") {
        query = query.eq(key, value === "true");
      } else {
        query = query.eq(key, value);
      }
    });
    return query;
  };

  return { updateFilters, getFilteredQuery, searchParams };
};