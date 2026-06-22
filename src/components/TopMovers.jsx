import { stockHoldings } from '../data/holdings'

export default function TopMovers() {
  const sorted = [...stockHoldings].sort((a, b) => b.dayChange - a.dayChange)
  const gainers = sorted.slice(0, 6)
  const losers = sorted.slice(-6).reverse()

  return (
    <div className="card rounded-2xl px-7 py-7">
      <h3 className="text-sm font-semibold text-slate-200 mb-7 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-red-400" />
        Today's Movers
      </h3>

      <div className="mb-7">
        <p className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-1.5">
          <span>↑</span> Top Gainers
        </p>
        <div className="grid grid-cols-2 gap-3">
          {gainers.map((h, i) => (
            <div key={h.symbol}
              className="group relative flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/[0.07] transition-all">
              <span className="text-[10px] font-bold text-emerald-500/60 tabular-nums w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{h.symbol}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">₹{h.ltp.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[12px] font-bold tabular-nums">
                +{h.dayChange.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] my-8" />

      <div>
        <p className="text-[10px] text-red-400/90 font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-1.5">
          <span>↓</span> Top Losers
        </p>
        <div className="grid grid-cols-2 gap-3">
          {losers.map((h, i) => (
            <div key={h.symbol}
              className="group relative flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.04] border border-red-500/10 hover:border-red-500/25 hover:bg-red-500/[0.07] transition-all">
              <span className="text-[10px] font-bold text-red-500/60 tabular-nums w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{h.symbol}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">₹{h.ltp.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 text-[12px] font-bold tabular-nums">
                {h.dayChange.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
