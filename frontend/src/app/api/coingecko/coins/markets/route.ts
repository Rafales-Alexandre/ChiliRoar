import { NextRequest } from 'next/server';

let cache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 60 secondes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const ids = searchParams.get('ids');

  if (!ids) {
    return new Response(JSON.stringify({ error: 'Missing ids parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  const cacheKey = `${vs_currency}:${ids}`;
  if (
    cache &&
    cache[cacheKey] &&
    now - cache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return new Response(JSON.stringify(cache[cacheKey].data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Appel à l'API CoinGecko
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${ids}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'CoinGecko error', status: res.status }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    if (!cache) cache = {};
    cache[cacheKey] = { data, timestamp: now };
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 