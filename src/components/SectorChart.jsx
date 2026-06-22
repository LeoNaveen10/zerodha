import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function SectorChart({ data, activeSector, onSectorClick }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="card rounded-2xl px-7 py-7">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-pink-400 to-purple-400" />
          Sector Allocation
        </h3>
        {activeSector !== 'All' && (
          <button onClick={() => onSectorClick(activeSector)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10">
            Clear ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-7">
        <div className="w-[190px] h-[190px] shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={62} outerRadius={92} dataKey="value"
                stroke="none" paddingAngle={3}
                onClick={(_, idx) => onSectorClick(data[idx].name)}
                style={{ cursor: 'pointer' }}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} opacity={activeSector === 'All' || activeSector === d.name ? 1 : 0.2} />
                ))}
              </Pie>
              <Tooltip content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="bg-[#0a0a14]/95 border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs shadow-2xl backdrop-blur">
                    <p className="font-semibold text-white">{d.name}</p>
                    <p className="text-slate-400 mt-0.5">₹{d.value.toLocaleString('en-IN')}</p>
                  </div>
                )
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Total</span>
            <span className="text-base font-bold text-white">₹{(total / 100000).toFixed(2)}L</span>
            <span className="text-[9px] text-slate-500 mt-1">{data.length} sectors</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {data.map(d => (
            <div key={d.name} onClick={() => onSectorClick(d.name)}
              className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all ${
                activeSector === d.name ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
              }`}>
              <span className="w-2 h-2 rounded-full shrink-0"
                style={{ background: d.color, opacity: activeSector === 'All' || activeSector === d.name ? 1 : 0.3 }} />
              <span className={`text-[11px] flex-1 ${activeSector === d.name ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {d.name}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold tabular-nums">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
