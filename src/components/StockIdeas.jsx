import { useState } from 'react'
import { stockIdeas } from '../data/stockIdeas'

export default function StockIdeas({ open, onClose }) {
  const [tab, setTab] = useState('shortTerm')
  if (!open || !stockIdeas) return null

  const items = tab === 'shortTerm' ? stockIdeas.shortTerm : stockIdeas.longTerm

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl card rounded-2xl p-10 animate-[fadeUp_0.3s_ease] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-400" />
              Stock Ideas
            </h2>
            <p className="text-[12px] text-slate-500 mt-2.5 ml-5">
              Outside your portfolio • {stockIdeas.date}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none mt-1 transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          {[['shortTerm', 'Short-Term'], ['longTerm', 'Long-Term']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wide transition-all ${
                tab === key
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}>
              {label}
              <span className="ml-2 text-[11px] tabular-nums text-slate-500">
                {(key === 'shortTerm' ? stockIdeas.shortTerm : stockIdeas.longTerm).length}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-6 mb-10">
          {items.map(s => (
            <div key={s.symbol} className="rounded-xl border border-[var(--color-border)] bg-white/[0.02] px-6 py-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[16px] font-bold text-white">{s.symbol}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{s.sector} • {s.exchange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                    s.conviction === 'high'
                      ? 'text-emerald-300 bg-emerald-500/10'
                      : 'text-amber-300 bg-amber-500/10'
                  }`}>{s.conviction}</span>
                  <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">↑ {s.upside}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  ['LTP', `₹${s.ltp.toLocaleString('en-IN')}`],
                  ['Target', `₹${s.analystTarget.toLocaleString('en-IN')}`],
                  ['Upside', s.upside],
                  ['Timeframe', s.timeframe],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-[13px] text-slate-300 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 leading-[1.7]">{s.thesis}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[var(--color-border)]">
          <p className="text-[11px] text-slate-500 leading-[1.7]">
            {tab === 'shortTerm'
              ? 'Short-term picks based on momentum, technical breakouts, and upcoming catalysts. Review before acting.'
              : 'Long-term picks based on strong fundamentals, sector tailwinds, and attractive valuations. DYOR before investing.'}
          </p>
        </div>
      </div>
    </div>
  )
}
