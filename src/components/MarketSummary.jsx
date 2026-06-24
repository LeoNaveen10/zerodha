import { stockHoldings } from '../data/holdings'

export default function MarketSummary() {
  const totalCurrent = stockHoldings.reduce((s, h) => s + h.ltp * h.qty, 0)
  const todayPnl = stockHoldings.reduce((s, h) => s + (h.ltp - h.closePrice) * h.qty, 0)
  const todayUp = todayPnl >= 0

  // Sector-wise today P&L
  const sectorToday = {}
  stockHoldings.forEach(h => {
    const pnl = (h.ltp - h.closePrice) * h.qty
    sectorToday[h.sector] = (sectorToday[h.sector] || 0) + pnl
  })
  const bestSector = Object.entries(sectorToday).sort((a, b) => b[1] - a[1])[0]
  const worstSector = Object.entries(sectorToday).sort((a, b) => a[1] - b[1])[0]

  // Top movers by impact
  const sorted = [...stockHoldings].sort((a, b) => (b.ltp - b.closePrice) * b.qty - (a.ltp - a.closePrice) * a.qty)
  const topGainer = sorted[0]
  const topLoser = sorted[sorted.length - 1]

  const gainers = stockHoldings.filter(h => h.ltp > h.closePrice).length
  const losers = stockHoldings.filter(h => h.ltp < h.closePrice).length

  const fmt = (v) => {
    const a = Math.abs(v)
    if (a >= 100000) return `₹${(a / 100000).toFixed(2)}L`
    if (a >= 1000) return `₹${(a / 1000).toFixed(1)}K`
    return `₹${a.toFixed(0)}`
  }

  return (
    <div className="card rounded-2xl p-7">
      <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-400" />
        Daily Summary
      </h3>

      <div className="space-y-6 text-[13px] text-slate-300 leading-relaxed">
        <p>
          Your portfolio is {todayUp ? (
            <span className="text-emerald-400 font-semibold">up {fmt(todayPnl)}</span>
          ) : (
            <span className="text-red-400 font-semibold">down {fmt(Math.abs(todayPnl))}</span>
          )} today, a <span className="text-white font-medium">{Math.abs((todayPnl / totalCurrent) * 100).toFixed(2)}%</span> move
          across {stockHoldings.length} holdings.
        </p>

        <p>
          Out of your positions, <span className="text-emerald-400 font-medium">{gainers} stocks are green</span> and{' '}
          <span className="text-red-400 font-medium">{losers} are red</span> for the day.
        </p>

        <p>
          <span className="text-white font-medium">{bestSector[0]}</span> is your best-performing sector today
          ({bestSector[1] >= 0 ? '+' : ''}{fmt(bestSector[1])}), while{' '}
          <span className="text-white font-medium">{worstSector[0]}</span> is the weakest
          ({worstSector[1] >= 0 ? '+' : '-'}{fmt(Math.abs(worstSector[1]))}).
        </p>

        <p>
          Your biggest contributor today is <span className="text-emerald-400 font-medium">{topGainer.symbol}</span> adding{' '}
          <span className="text-emerald-400">+{fmt((topGainer.ltp - topGainer.closePrice) * topGainer.qty)}</span> to your portfolio,
          while <span className="text-red-400 font-medium">{topLoser.symbol}</span> is the biggest drag with{' '}
          <span className="text-red-400">-{fmt(Math.abs((topLoser.ltp - topLoser.closePrice) * topLoser.qty))}</span>.
        </p>

        {todayUp ? (
          <p className="text-slate-400 text-[12px] italic">
            A positive session for long-term compounding. Daily moves are noise — stay focused on your multi-year thesis.
          </p>
        ) : (
          <p className="text-slate-400 text-[12px] italic">
            A red day is part of the journey. Short-term dips often create long-term buying opportunities — stay patient with your thesis.
          </p>
        )}
      </div>
    </div>
  )
}
