import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
// Intentionally not importing previously created `common` components
// (StatisticsCards, CardSkelton, DashboardOverview, ReportManager, EmailTemplateEditor)
// This file implements a unique, self-contained dashboard UI as requested.
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
  
export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Mock stats for `StatisticsCards` component
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    deletedUser: 0,
  });

  // --- typed state models for better linting and maintainability ---
  interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    joined: string;
  }

  interface Activity {
    id: number;
    message: string;
    time: string;
  }

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  // timeframe for signups chart: '7d' | '30d' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'month' | 'year'>('7d');
  const [series, setSeries] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    // Simulate network loading and fetch mock data
    const t = setTimeout(() => {
      setStats({
        totalUsers: 15642,
        activeUsers: 12450,
        inactiveUsers: 312,
        deletedUser: 120,
      });

      setRecentUsers([
        { id: 1, name: 'Jane Cooper', email: 'jane@example.com', role: 'User', status: 'Active', joined: '2d ago' },
        { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: '4d ago' },
        { id: 3, name: 'Sara Connor', email: 'sara@example.com', role: 'Editor', status: 'Pending', joined: '1w ago' },
        { id: 4, name: 'Tom Hardy', email: 'tom@example.com', role: 'User', status: 'Inactive', joined: '3w ago' },
      ]);

      setActivities([
        { id: 1, message: 'New user registered: jane@example.com', time: '5 minutes' },
        { id: 2, message: 'Payment succeeded for order #2342', time: '28 minutes' },
        { id: 3, message: 'Password changed: john@example.com', time: '2 hours' },
        { id: 4, message: 'API key rotated by admin', time: '1 day' },
      ]);

      // tasks removed - no longer setting tasks data

      setLoading(false);
    }, 700);

    return () => clearTimeout(t);
  }, []);

  // Generate simple mock series based on timeframe (UI-only)
  useEffect(() => {
    function generateSeries(tf: typeof timeframe) {
      const out: { label: string; value: number }[] = [];
      if (tf === '7d') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
          out.push({ label: days[i], value: Math.round(30 + Math.random() * 90) });
        }
      } else if (tf === '30d') {
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          out.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, value: Math.round(20 + Math.random() * 140) });
        }
      } else if (tf === 'month') {
        // show daily for current month (assume 30 for simplicity)
        for (let i = 1; i <= 30; i++) {
          out.push({ label: `${i}`, value: Math.round(10 + Math.random() * 160) });
        }
      } else if (tf === 'year') {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        for (let i = 0; i < 12; i++) {
          out.push({ label: months[i], value: Math.round(400 + Math.random() * 1200) });
        }
      }
      return out;
    }

    setSeries(generateSeries(timeframe));
  }, [timeframe]);

  return (
    <main className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of system health, activity and KPIs</p>
        </div> 
      </div>

      {/* Top statistics - custom inline cards (unique design, shimmer while loading) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-4" />
                <div className="h-8 w-32 bg-muted rounded" />
              </div>
            ))
          : [
              { title: 'Total Users', value: stats.totalUsers, emoji: '👥', color: 'text-blue-600' },
              { title: 'Active Users', value: stats.activeUsers, emoji: '✅', color: 'text-green-600' },
              { title: 'Inactive Users', value: stats.inactiveUsers, emoji: '⏸️', color: 'text-red-600' },
            ].map((s, idx) => (
              <div key={idx} className="bg-card text-card-foreground flex flex-col rounded-xl border">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">{s.title}</div>
                      <div className="text-2xl font-bold mt-2">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <span className={`${s.color} text-xl`}>{s.emoji}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <div className="h-2 w-full bg-muted rounded overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-transparent to-white/30" style={{ width: `${(Math.min(Number(s.value) || 0, 100) / 100) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Main overview with small custom chart placeholders (UI-only) */}
      <div className="bg-card rounded-xl border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">User Signups (7 days)</h3>
            <p className="text-sm text-muted-foreground">A clearer area sparkline with points</p>
          </div>
            <div className="flex items-center gap-3">
              <label htmlFor="tf" className="text-sm text-muted-foreground">Range</label>
              <select
                id="tf"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="rounded-md border px-2 py-1 bg-card text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
        </div>

        <div className="w-full h-56 rounded-md overflow-hidden">
          <svg viewBox="0 0 240 80" className="w-full h-full">
            <defs>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Render generated series into an area + line + points with axes and labels */}
            {(() => {
              const svgW = 240;
              const svgH = 80; // overall svg height
              // chart drawing area inside svg
              const leftPad = 28;
              const rightPad = 8;
              const topPad = 6;
              const bottomPad = 18; // room for x labels
              const w = svgW - leftPad - rightPad;
              const h = svgH - topPad - bottomPad; // chart area height

              const n = Math.max(1, series.length);
              const xs: number[] = [];
              const ys: number[] = [];
              const values = series.map((s) => s.value);
              const max = Math.max(...values, 1);
              const min = Math.min(...values, 0);

              for (let i = 0; i < n; i++) {
                const x = leftPad + (i / Math.max(1, n - 1)) * w;
                const v = values[i];
                const y = topPad + (1 - (v - min) / Math.max(1, max - min)) * h;
                xs.push(x);
                ys.push(y);
              }

              // compute area path and line points
              const areaPath = (() => {
                if (!n) return '';
                let p = `M ${xs[0]} ${ys[0]}`;
                for (let i = 1; i < n; i++) p += ` L ${xs[i]} ${ys[i]}`;
                p += ` L ${leftPad + w} ${topPad + h} L ${leftPad} ${topPad + h} Z`;
                return p;
              })();

              const linePoints = xs.map((x, i) => `${x},${ys[i]}`).join(' ');

              // y axis ticks (max, mid, min)
              const ticks = 4;
              const tickValues: { y: number; value: number }[] = [];
              for (let t = 0; t <= ticks; t++) {
                const pct = t / ticks;
                const val = Math.round((max - pct * (max - min)));
                const y = topPad + pct * h;
                tickValues.push({ y, value: val });
              }

              return (
                <>
                  {/* grid lines */}
                  <g stroke="#e6eefb" strokeWidth={0.6}>
                    {tickValues.map((tv, i) => (
                      <line key={i} x1={leftPad} y1={tv.y} x2={leftPad + w} y2={tv.y} />
                    ))}
                  </g>

                  {/* y axis and labels */}
                  <g>
                    <line x1={leftPad} y1={topPad} x2={leftPad} y2={topPad + h} stroke="#cbd5e1" strokeWidth={1.2} />
                    {tickValues.map((tv, i) => (
                      <text key={i} x={4} y={tv.y + 4} fontSize={9} fill="#64748b">{tv.value}</text>
                    ))}
                  </g>

                  {/* area and line */}
                  <path d={areaPath} fill="url(#areaGrad)" stroke="none" />
                  <polyline points={linePoints} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

                  {/* points */}
                  <g fill="#fff" stroke="#2563eb" strokeWidth={1}>
                    {xs.map((x, i) => (
                      <circle key={i} cx={x} cy={ys[i]} r={3.5} />
                    ))}
                  </g>

                  {/* x labels */}
                  <g>
                    {series.map((s, i) => (
                      <text key={i} x={xs[i]} y={topPad + h + 14} fontSize={9} fill="#64748b" textAnchor="middle">
                        {s.label}
                      </text>
                    ))}
                  </g>
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Two column area: Activity + Tasks on left, Recent Users + Reports / Email quick view on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 animate-pulse">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-muted rounded" />
                        <div className="h-3 w-1/3 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {activities.map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{a.message}</div>
                        <div className="text-xs text-muted-foreground">{a.time} ago</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Tasks removed - custom UI only as requested */}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/50">
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell>{u.status}</TableCell>
                        <TableCell>{u.joined}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Reports and Quick Email removed per request */}
        </div>
      </div>
    </main>
  );
}
