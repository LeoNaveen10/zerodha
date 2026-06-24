import { stockHoldings } from '../data/holdings'

export default function RiskAnalysis() {
  const totalCurrent = stockHoldings.reduce((s, h) => s + h.ltp * h.qty, 0)

  // Concentration
  const byValue = [...stockHoldings].map(h => ({ ...h, value: h.ltp * h.qty })).sort((a, b) => b.value - a.value)
  const top3 = byValue.slice(0, 3)
  const top3Pct = (top3.reduce((s, h) => s + h.value, 0) / totalCurrent * 100).toFixed(0)

  // Sector
  const sectorMap = {}
  stockHoldings.forEach(h => { sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.ltp * h.qty })
  const sectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1])
  const maxSector = sectors[0]
  const maxSectorPct = (maxSector[1] / totalCurrent * 100).toFixed(0)

  // Losers
  const losers = stockHoldings.filter(h => h.pnl < 0).sort((a, b) => a.pnl - b.pnl)
  const totalLoss = losers.reduce((s, h) => s + h.pnl, 0)
  const winners = stockHoldings.filter(h => h.pnl >= 0)
  const winRate = ((winners.length / stockHoldings.length) * 100).toFixed(0)

  // IT stocks all in loss?
  const itStocks = stockHoldings.filter(h => h.sector === 'IT')
  const itAllRed = itStocks.every(h => h.pnl < 0)

  // Worst holding
  const worst = losers[0]
  const worstRetPct = (worst.pnl / (worst.avgPrice * worst.qty) * 100).toFixed(0)

  const fmt = (v) => {
    const a = Math.abs(v)
    if (a >= 100000) return `₹${(a / 100000).toFixed(2)}L`
    if (a >= 1000) return `₹${(a / 1000).toFixed(1)}K`
    return `₹${a.toFixed(0)}`
  }

  // Risk level
  let riskPoints = 0
  if (parseInt(top3Pct) > 40) riskPoints += 2
  if (parseInt(maxSectorPct) > 30) riskPoints += 2
  if (losers.length > stockHoldings.length * 0.4) riskPoints += 1
  const riskLabel = riskPoints >= 4 ? 'High' : riskPoints >= 2 ? 'Moderate' : 'Low'
  const riskColor = riskPoints >= 4 ? 'text-red-400' : riskPoints >= 2 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="card rounded-2xl p-7">
      <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-red-400 to-amber-400" />
        Risk Analysis
      </h3>

      <div className="space-y-6 text-[13px] text-slate-300 leading-relaxed">
        <p>
          Your portfolio risk level is assessed as{' '}
          <span className={`font-bold ${riskColor}`}>{riskLabel}</span>.
          You currently hold {stockHoldings.length} stocks with a win rate of{' '}
          <span className="text-white font-medium">{winRate}%</span> ({winners.length} profitable, {losers.length} in loss).
        </p>

        <p>
          <span className="text-white font-medium">Concentration is elevated</span> — your top 3 holdings
          ({top3.map(h => h.symbol).join(', ')}) make up <span className="text-amber-400 font-medium">{top3Pct}%</span> of
          the portfolio. A sharp move in any of these stocks would have an outsized impact.
        </p>

        <p>
          <span className="text-white font-medium">{maxSector[0]}</span> dominates at{' '}
          <span className="text-amber-400 font-medium">{maxSectorPct}%</span> allocation — well above the ideal 20-25% per sector.
          This creates correlated risk during sector-specific events like policy changes or rate decisions.
        </p>

        {itAllRed && (
          <p>
            Notably, <span className="text-red-400 font-medium">all {itStocks.length} IT stocks are in loss</span> — however,
            IT remains a long-term secular growth story. If your conviction in the sector thesis is intact,
            these drawdowns may present averaging opportunities over time.
          </p>
        )}

        <p>
          Your largest single loss is <span className="text-red-400 font-medium">{worst.symbol}</span> at{' '}
          <span className="text-red-400">-{fmt(Math.abs(worst.pnl))}</span> ({worstRetPct}% return).
          Total unrealized losses across {losers.length} positions amount to{' '}
          <span className="text-red-400 font-medium">-{fmt(Math.abs(totalLoss))}</span>.
        </p>

        <p className="text-slate-400 text-[12px] italic">
          Think in years, not days. Temporary drawdowns are normal for wealth-building portfolios.
          Focus on business fundamentals and rebalance gradually — avoid panic selling on short-term noise.
        </p>
      </div>
    </div>
  )
}
