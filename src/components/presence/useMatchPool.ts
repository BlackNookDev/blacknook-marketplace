'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiUrl';

export type MatchPoolPerson = {
  id: string;
  initials: string;
  color: string;
  role: string;
};

export function useMatchPool() {
  const [count, setCount] = useState(0);
  const [people, setPeople] = useState<MatchPoolPerson[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiFetch('/api/match-pool');
        const data = (await res.json().catch(() => ({}))) as {
          count?: number;
          people?: MatchPoolPerson[];
        };
        if (cancelled) return;
        setCount(Number(data.count) || 0);
        setPeople(Array.isArray(data.people) ? data.people : []);
      } catch {
        if (!cancelled) {
          setCount(0);
          setPeople([]);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    void load();
    const id = window.setInterval(() => void load(), 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return { count, people, loaded };
}
