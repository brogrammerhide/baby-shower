import { NextResponse } from 'next/server';

// Ensure this route handler is executed dynamically on every request
export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      uptime: {
        seconds: Math.floor(uptime),
        formatted: formatUptime(uptime),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        rss: formatMemory(memoryUsage.rss),
        heapTotal: formatMemory(memoryUsage.heapTotal),
        heapUsed: formatMemory(memoryUsage.heapUsed),
        external: formatMemory(memoryUsage.external),
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

function formatMemory(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
