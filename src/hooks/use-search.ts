"use client";

import { useState, useEffect, useCallback } from "react";
import { globalSearch, SearchResults } from "@/actions/search";

const EMPTY: SearchResults = { projects: [], tasks: [], users: [], organizations: [] };

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults(EMPTY); return; }
    setLoading(true);
    try {
      const data = await globalSearch(q);
      setResults(data);
    } catch {
      setResults(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const clear = () => { setQuery(""); setResults(EMPTY); };

  const hasResults =
    results.projects.length > 0 ||
    results.tasks.length > 0 ||
    results.users.length > 0 ||
    results.organizations.length > 0; 

  return { query, setQuery, results, loading, hasResults, clear };
}