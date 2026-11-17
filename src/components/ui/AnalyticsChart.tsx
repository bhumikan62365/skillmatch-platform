import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'horizontal_bar' | 'donut';
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  secondaryDataKey?: string;
  height?: number;
}

const CHART_COLORS = ['#2563EB', '#0F172A', '#16A34A', '#D97706', '#64748B'];

export function AnalyticsChart({
  title,
  subtitle,
  type,
  data,
  dataKey,
  nameKey,
  secondaryDataKey,
  height = 260,
}: AnalyticsChartProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#0F172A] font-display">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {data.length === 0 ? (
        <div
          style={{ height }}
          className="flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg"
        >
          No chart data available
        </div>
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'donut' ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  innerRadius={56}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            ) : type === 'horizontal_bar' ? (
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 20, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  dataKey={nameKey}
                  type="category"
                  width={110}
                  tick={{ fontSize: 11, fill: '#0F172A' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey={dataKey} fill="#2563EB" radius={[0, 4, 4, 0]} barSize={18} />
                {secondaryDataKey && (
                  <Bar
                    dataKey={secondaryDataKey}
                    fill="#94A3B8"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                )}
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey={dataKey} fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
                {secondaryDataKey && (
                  <Bar
                    dataKey={secondaryDataKey}
                    fill="#0F172A"
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
