import { todaysBuy } from '../data/todaysBuy'

export default function TodaysBuy({ open, onClose }) {
  if (!open || !todaysBuy) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg card rounded-2xl p-7 animate-[fadeUp_0.3s_ease]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-cyan-400" />
              Today's Buy
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Budget: ₹{todaysBuy.budget.toLocaleString('en-IN')} • {todaysBuy.date}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Suggestions */}
        <div className="space-y-3 mb-6">
          {todaysBuy.suggestions.map(s => (
            <div key={s.symbol} className="rounded-xl border border-[var(--color-border)] bg-white/[0.02] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[14px] font-bold text-white">{s.symbol}</span>
                  <span className="ml-2 text-[10px] text-slate-500">{s.sector} • {s.exchange}</span>
                </div>
                <span className="text-[12px] font-bold text-emerald-400">↑ {s.upside}</span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-slate-400 mb-2">
                <span>LTP: ₹{s.ltp.toLocaleString('en-IN')}</span>
                <span>Qty: {s.qty}</span>
                <span>Cost: ₹{s.cost.toLocaleString('en-IN')}</span>
                <span>Target: ₹{s.analystTarget.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.reason}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="text-[12px] text-slate-400">
            <span>Total: ₹{todaysBuy.totalCost.toLocaleString('en-IN')}</span>
            <span className="ml-4">Remaining: ₹{todaysBuy.remainingBudget.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3">{todaysBuy.rationale}</p>
      </div>
    </div>
  )
}
