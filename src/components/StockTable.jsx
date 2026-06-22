import { useState, useMemo } from 'react'
import { stockHoldings, sectorColors } from '../data/holdings'

export default function StockTable({ sectorFilter, setSectorFilter }) {
  const [sortBy, setSortBy] = useState('pnl')
  const [sortDir, setSortDir] = useState(-1)
  const sectors = ['All', ...new Set(stockHoldings.map(h => h.sector))]

  const sorted = useMemo(() => {
    let data = sectorFilter === 'All' ? stockHoldings : stockHoldings.filter(h => h.sector === sectorFilter)
    return [...data].sort((a, b) => {
      if (sortBy === 'return') {
        const ra = a.pnl / (a.avgPrice * a.qty)
        const rb = b.pnl / (b.avgPrice * b.qty)
        return (ra - rb) * sortDir
      }
      if (sortBy === 'invested') return (a.avgPrice * a.qty - b.avgPrice * b.qty) * sortDir
      if (sortBy === 'current') return (a.ltp * a.qty - b.ltp * b.qty) * sortDir
      return (a[sortBy] - b[sortBy]) * sortDir
    })
  }, [sortBy, sortDir, sectorFilter])

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d * -1)
    else { setSortBy(col); setSortDir(-1) }
  }

  return (
    <div className="card rounded-2xl">
      {/* Filter Pills */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectors.map(s => {
              const active = sectorFilter === s
              const dot = s === 'All' ? null : sectorColors[s]
              return (
                <button key={s} onClick={() => setSectorFilter(s)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${active
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                    : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-slate-100 hover:bg-white/[0.06] hover:border-white/10'}`}>
                  {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#fff' : dot }} />}
                  {s}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-slate-500 tabular-nums shrink-0">{sorted.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '820px' }}>
          <thead>
            <tr className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-[var(--color-border)] bg-white/[0.015]">
              <th className="text-left px-5 py-3.5 font-semibold">Stock</th>
              <SortTh label="Qty" col="qty" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="Avg" col="avgPrice" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="Invested" col="invested" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="LTP" col="ltp" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="Current" col="current" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="P&L" col="pnl" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="Return" col="return" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              <SortTh label="Day" col="dayChange" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} last />
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => {
              const invested = h.avgPrice * h.qty
              const current = h.ltp * h.qty
              const returnPct = (h.pnl / invested) * 100
              return (
                <tr key={h.symbol} className={`border-b border-[var(--color-border)]/30 hover:bg-white/[0.02] transition-colors ${i === sorted.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1 h-8 rounded-full shrink-0" style={{ background: sectorColors[h.sector] }} />
                      <div>
                        <p className="font-semibold text-white text-[13px]">{h.symbol}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">{h.sector} · {h.exchange}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-3.5 text-right text-slate-300 font-medium text-[13px]">{h.qty}</td>
                  <td className="px-2.5 py-3.5 text-right text-slate-400 text-[13px]">₹{h.avgPrice.toFixed(0)}</td>
                  <td className="px-2.5 py-3.5 text-right text-slate-400 text-[13px]">₹{(invested / 1000).toFixed(1)}K</td>
                  <td className="px-2.5 py-3.5 text-right text-white font-semibold text-[13px]">₹{h.ltp.toFixed(0)}</td>
                  <td className="px-2.5 py-3.5 text-right text-white font-medium text-[13px]">₹{(current / 1000).toFixed(1)}K</td>
                  <td className={`px-2.5 py-3.5 text-right font-semibold text-[13px] ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-2.5 py-3.5 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${returnPct >= 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                      {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className={`pr-10 pl-2.5 py-3.5 text-right font-medium text-[12px] whitespace-nowrap ${h.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.dayChange >= 0 ? '▲' : '▼'}{Math.abs(h.dayChange).toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortTh({ label, col, sortBy, sortDir, onClick, last }) {
  const active = sortBy === col
  const pad = last ? 'pr-10 pl-2.5' : 'px-2.5'
  return (
    <th
      className={`text-right ${pad} py-3.5 font-semibold cursor-pointer select-none transition-colors group whitespace-nowrap ${active ? 'text-indigo-300' : 'hover:text-slate-300'}`}
      onClick={() => onClick(col)}
    >
      <span className="inline-flex items-center gap-1 justify-end">
        {label}
        {active ? (
          <span className="text-indigo-400 text-[10px] leading-none">{sortDir === -1 ? '▼' : '▲'}</span>
        ) : (
          <span className="text-slate-700 group-hover:text-slate-500 text-[9px] leading-none">⇅</span>
        )}
      </span>
    </th>
  )
}
