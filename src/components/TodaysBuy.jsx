import { todaysBuy } from '../data/todaysBuy'

export default function TodaysBuy({ open, onClose }) {
  if (!open || !todaysBuy) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl card rounded-2xl p-10 animate-[fadeUp_0.3s_ease]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-cyan-400" />
              Today's Buy
            </h2>
            <p className="text-[12px] text-slate-500 mt-2.5 ml-5">
              Budget: ₹{todaysBuy.budget.toLocaleString('en-IN')} • {todaysBuy.date}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none mt-1 transition-colors">✕</button>
        </div>

        {/* Suggestions */}
        <div className="space-y-6 mb-10">
          {todaysBuy.suggestions.map(s => (
            <div key={s.symbol} className="rounded-xl border border-[var(--color-border)] bg-white/[0.02] px-6 py-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[16px] font-bold text-white">{s.symbol}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{s.sector} • {s.exchange}</span>
                </div>
                <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">↑ {s.upside}</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  ['LTP', `₹${s.ltp.toLocaleString('en-IN')}`],
                  ['Qty', s.qty],
                  ['Cost', `₹${s.cost.toLocaleString('en-IN')}`],
                  ['Target', `₹${s.analystTarget.toLocaleString('en-IN')}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-[13px] text-slate-300 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 leading-[1.7]">{s.reason}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between text-[13px] text-slate-400">
            <span>Total: <span className="text-slate-300 font-medium">₹{todaysBuy.totalCost.toLocaleString('en-IN')}</span></span>
            <span>Remaining: <span className="text-slate-300 font-medium">₹{todaysBuy.remainingBudget.toLocaleString('en-IN')}</span></span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 leading-[1.7]">{todaysBuy.rationale}</p>
        </div>
      </div>
    </div>
  )
}
