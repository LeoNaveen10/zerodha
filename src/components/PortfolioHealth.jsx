import { portfolioHealth } from '../data/portfolioHealth'

const scoreStyles = {
  high: { text: 'text-emerald-400', bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400', accent: 'bg-gradient-to-b from-emerald-400 to-emerald-600', glow: 'shadow-emerald-500/20' },
  mid: { text: 'text-amber-400', bar: 'bg-gradient-to-r from-amber-500 to-amber-400', accent: 'bg-gradient-to-b from-amber-400 to-amber-600', glow: 'shadow-amber-500/20' },
  low: { text: 'text-red-400', bar: 'bg-gradient-to-r from-red-500 to-red-400', accent: 'bg-gradient-to-b from-red-400 to-red-600', glow: 'shadow-red-500/20' },
}

function getStyle(score) {
  if (score >= 80) return scoreStyles.high
  if (score >= 60) return scoreStyles.mid
  return scoreStyles.low
}

export default function PortfolioHealth() {
  if (!portfolioHealth) return null

  const { score, breakdown, summary, date } = portfolioHealth
  const style = getStyle(score)

  return (
    <div className="card rounded-2xl px-8 py-8">
      <h3 className="text-sm font-semibold text-slate-200 mb-8 flex items-center gap-2">
        <span className={`w-1 h-4 rounded-full ${style.accent}`} />
        Portfolio Health Score
        <span className="ml-auto text-[10px] text-slate-500">{date}</span>
      </h3>

      {/* Score hero */}
      <div className="flex items-center gap-6 mb-10">
        <div className={`text-5xl font-bold ${style.text} ${style.glow} drop-shadow-lg`}>{score}</div>
        <div className="flex-1 space-y-2">
          <div className="h-3 rounded-full bg-slate-800/80 overflow-hidden">
            <div className={`h-full rounded-full ${style.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-[11px] text-slate-500">out of 100</p>
        </div>
      </div>

      {/* Breakdown grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {breakdown.map(b => {
          const s = getStyle(b.score)
          return (
            <div key={b.factor} className="rounded-xl border border-[var(--color-border)] bg-white/[0.015] px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-300">{b.factor}</span>
                <span className={`text-[13px] font-bold ${s.text}`}>{b.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800/60 overflow-hidden">
                <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${b.score}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{b.comment}</p>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="border-t border-[var(--color-border)] pt-5">
        <p className="text-[12px] text-slate-400 leading-relaxed">{summary}</p>
      </div>
    </div>
  )
}
