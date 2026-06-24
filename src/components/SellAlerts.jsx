import { sellAlerts } from '../data/sellAlerts'

export default function SellAlerts() {
  if (!sellAlerts || !sellAlerts.alerts.length) return null

  return (
    <div className="card rounded-2xl px-7 py-7">
      <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-red-400 to-amber-400" />
        Sell Alerts
        <span className="ml-auto text-[10px] text-slate-500">{sellAlerts.date}</span>
      </h3>

      <div className="space-y-3">
        {sellAlerts.alerts.map(a => (
          <div key={a.symbol} className="rounded-xl border border-red-500/15 bg-red-500/[0.03] px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-white">{a.symbol}</span>
                <span className="text-[10px] text-slate-500">{a.sector}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                a.severity === 'high' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
              }`}>{a.severity}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{a.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
