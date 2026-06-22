export default function PortfolioSummary({ stats }) {
  const {
    totalInvested, mfInvested, totalCurrent, mfCurrent,
    totalPnl, totalPnlPct, mfPnl, mfPnlPct,
    todayPnl, todayPnlPct, totalPortfolio,
  } = stats

  const grandInvested = totalInvested + mfInvested
  const grandPnl = totalPortfolio - grandInvested
  const grandPnlPct = (grandPnl / grandInvested) * 100

  const fmt = (v) => {
    const a = Math.abs(v)
    if (a >= 100000) return `${(a / 100000).toFixed(2)}L`
    if (a >= 1000) return `${(a / 1000).toFixed(1)}K`
    return a.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  }

  const todayUp = todayPnl >= 0
  const allTimeUp = grandPnl >= 0

  const metrics = [
    { label: 'Total Invested', value: grandInvested, tone: 'neutral' },
    { label: 'Total Returns', value: grandPnl, pct: grandPnlPct, tone: allTimeUp ? 'gain' : 'loss' },
    { label: 'Stocks P&L', value: totalPnl, pct: totalPnlPct, tone: totalPnl >= 0 ? 'gain' : 'loss' },
    { label: 'Mutual Funds P&L', value: mfPnl, pct: mfPnlPct, tone: mfPnl >= 0 ? 'gain' : 'loss' },
  ]

  const toneText = { gain: 'text-emerald-300', loss: 'text-red-300', neutral: 'text-white' }
  const toneChip = {
    gain: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20',
    loss: 'bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/20',
    neutral: 'bg-slate-500/10 text-slate-300 ring-1 ring-inset ring-slate-500/20',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Hero: Portfolio Value — centered text, no sparkline */}
      <div className="lg:col-span-4 relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-600/20 via-indigo-700/10 to-cyan-600/10 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="absolute right-0 top-0 w-44 h-44 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
        <div className="absolute left-0 bottom-0 w-36 h-36 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-xs text-indigo-300/80 uppercase tracking-[0.15em] font-semibold">
            Portfolio Value
          </p>
          <p className="text-[42px] font-bold tracking-tight text-white leading-none tabular-nums">
            ₹{fmt(totalPortfolio)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${toneChip[allTimeUp ? 'gain' : 'loss']}`}>
              {allTimeUp ? '↑' : '↓'} {Math.abs(grandPnlPct).toFixed(2)}%
            </span>
            <span className={`text-[11px] font-medium tabular-nums ${allTimeUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {allTimeUp ? '+' : '-'}₹{fmt(grandPnl)} all-time
            </span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold mt-1 ${toneChip[todayUp ? 'gain' : 'loss']}`}>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider">Today</span>
            <span>{todayUp ? '↑' : '↓'}</span>
            <span>{todayUp ? '+' : '-'}₹{fmt(todayPnl)}</span>
            <span>({Math.abs(todayPnlPct).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Supporting metric tiles — centered text */}
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/40 p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
            <p className="text-[11px] text-slate-500 uppercase tracking-[0.12em] font-semibold mb-3">{m.label}</p>
            <p className={`text-[24px] font-bold tracking-tight leading-none tabular-nums ${toneText[m.tone]}`}>
              {m.value < 0 ? '-' : ''}₹{fmt(m.value)}
            </p>
            {m.pct !== undefined && (
              <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold ${toneChip[m.tone]}`}>
                <span>{m.pct >= 0 ? '↑' : '↓'}</span>
                {Math.abs(m.pct).toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
