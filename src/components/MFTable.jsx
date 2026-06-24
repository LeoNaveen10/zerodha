import { mfHoldings, mfCategoryColors } from '../data/holdings'

export default function MFTable() {
  return (
    <div className="card rounded-2xl">
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-[var(--color-border)] bg-white/[0.015]">
              <th className="text-left px-3 py-3.5 font-semibold">Fund</th>
              <th className="hidden lg:table-cell text-right px-1.5 py-3.5 font-semibold">Units</th>
              <th className="text-right px-1.5 py-3.5 font-semibold">NAV</th>
              <th className="hidden xl:table-cell text-right px-1.5 py-3.5 font-semibold">Invested</th>
              <th className="text-right px-1.5 py-3.5 font-semibold">Current</th>
              <th className="text-right px-1.5 py-3.5 font-semibold">P&L</th>
              <th className="text-right pr-3 pl-1.5 py-3.5 font-semibold">Return</th>
            </tr>
          </thead>
          <tbody>
            {mfHoldings.map((h, i) => {
              const invested = h.avgPrice * h.qty
              const current = h.ltp * h.qty
              const pnl = current - invested
              const pnlPct = (pnl / invested) * 100
              return (
                <tr key={h.symbol} className={`border-b border-[var(--color-border)]/30 hover:bg-white/[0.02] ${i === mfHoldings.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-7 rounded-full shrink-0" style={{ background: mfCategoryColors[h.category] || '#64748b' }} />
                      <div>
                        <p className="font-semibold text-white text-[13px] max-w-[240px] truncate">{h.fund}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">{h.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-1.5 py-3.5 text-right text-slate-300 font-medium text-[13px]">{h.qty.toFixed(1)}</td>
                  <td className="px-1.5 py-3.5 text-right text-white font-semibold text-[13px]">₹{h.ltp.toFixed(2)}</td>
                  <td className="hidden xl:table-cell px-1.5 py-3.5 text-right text-slate-300 text-[13px]">₹{(invested / 1000).toFixed(1)}K</td>
                  <td className="px-1.5 py-3.5 text-right text-white font-medium text-[13px]">₹{(current / 1000).toFixed(1)}K</td>
                  <td className={`px-1.5 py-3.5 text-right font-semibold text-[13px] ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toFixed(0)}
                  </td>
                  <td className="pr-3 pl-1.5 py-3.5 text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${pnlPct >= 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                      {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                    </span>
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
