import { NextRequest } from 'next/server';

let cache: any = null;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET(req: NextRequest, { params }: { params: { coinId: string } }) {
  const { coinId } = params;
  const { searchParams } = new URL(req.url);
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const days = searchParams.get('days') || '1';
  const interval = searchParams.get('interval') || 'hourly';

  if (!coinId) {
    return new Response(JSON.stringify({ error: 'Missing coinId parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  const cacheKey = `${coinId}:${vs_currency}:${days}:${interval}`;
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
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}&interval=${interval}`;
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