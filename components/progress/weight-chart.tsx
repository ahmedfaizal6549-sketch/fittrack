'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const weights = data.map(d => d.weight)
  const min = Math.floor(Math.min(...weights)) - 1
  const max = Math.ceil(Math.max(...weights)) + 1

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece8" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888' }} tickLine={false} />
        <YAxis domain={[min, max]} tick={{ fontSize: 11, fill: '#888' }} tickLine={false} axisLine={false} unit="kg" />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e0dc', fontSize: 12 }}
          formatter={(v) => [`${v} kg`, 'Weight']}
        />
        <Line type="monotone" dataKey="weight" stroke="oklch(62% 0.16 42)" strokeWidth={2.5} dot={{ r: 4, fill: 'oklch(62% 0.16 42)' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
