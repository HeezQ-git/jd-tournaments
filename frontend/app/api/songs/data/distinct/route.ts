'use server';

import { useSupabaseServer } from '@/utils/supabase/supabaseSSR';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort: string | null = searchParams.get('sort');

  const supabase = useSupabaseServer();

  const items = [
    { name: 'artists', isArray: true },
    { name: 'game', isArray: false },
    { name: 'tags', isArray: true },
    { name: 'version', isArray: false },
    { name: 'exclusivity', isArray: false },
  ];

  const results = await Promise.all(
    items.map(async (item) => {
      const valuesSet = new Set();

      const { data } = await supabase.from('songs').select(item.name);

      Object.values(data || []).forEach((row) => {
        if (item.isArray) {
          Object.values(row[item.name as any] || []).forEach((value) => {
            if (value === 'NULL' || !value) return;
            valuesSet.add(value);
          });
        } else {
          const value = row[item.name as any];
          if (value === 'NULL' || !value) return;
          valuesSet.add(value);
        }
      });

      const values = Array.from(valuesSet) as string[];

      if (sort === 'asc') {
        values.sort((a, b) => a.localeCompare(b));
      } else if (sort === 'desc') {
        values.sort((a, b) => b.localeCompare(a));
      }

      return { name: item.name, values };
    }),
  );

  const response: { [key: string]: string[] } = {};

  results.forEach((result) => {
    response[result.name] = result.values;
  });

  return NextResponse.json(response);
}
