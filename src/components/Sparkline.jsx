import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts'

export default function Sparkline({ data, color = '#10b981', height = '100%', showTooltip = false }) {
  const gradId = `sparkGrad-${color.replace('#', '')}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        {showTooltip && (
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
            content={({ payload }) => {
              if (!payload?.length) return null
              const v = payload[0].payload.v
              return (
                <div className="bg-[#0a0a14]/95 border border-[var(--color-border)] rounded-md px-2 py-1 text-[10px] text-white shadow-xl backdrop-blur">
                  ₹{Math.round(v).toLocaleString('en-IN')}
                </div>
              )
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          isAnimationActive={true}
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
