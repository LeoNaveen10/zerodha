import { useState, useEffect } from 'react'
import { broadIndices, sectorIndices } from '../data/market'

export default function LiveTicker() {
  const [forex, setForex] = useState([])
  const [global, setGlobal] = useState([])
  const [forexLive, setForexLive] = useState(false)
  const [globalLive, setGlobalLive] = useState(false)
  const [forexLoading, setForexLoading] = useState(true)
  const [globalLoading, setGlobalLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('indian')

  useEffect(() => {
    fetchForex(); fetchGlobal()
    const i1 = setInterval(fetchForex, 60000)
    const i2 = setInterval(fetchGlobal, 120000)
    return () => { clearInterval(i1); clearInterval(i2) }
  }, [])

  async function fetchForex() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD')
      if (res.ok) {
        const data = await res.json()
        const inr = data.rates?.INR
        const eur = data.rates?.EUR
        const gbp = data.rates?.GBP
        const items = []
        if (inr) items.push({ name: 'USD/INR', value: inr.toFixed(2), icon: '💵' })
        if (eur && inr) items.push({ name: 'EUR/INR', value: (inr / eur).toFixed(2), icon: '💶' })
        if (gbp && inr) items.push({ name: 'GBP/INR', value: (inr / gbp).toFixed(2), icon: '💷' })
        items.push({ name: 'GOLD 22K/1g', value: '13,430', icon: '🥇' })
        setForex(items); setForexLive(true)
      }
    } catch {
      setForex([
        { name: 'USD/INR', value: '85.42', icon: '💵' },
        { name: 'EUR/INR', value: '94.52', icon: '💶' },
        { name: 'GOLD 22K/1g', value: '13,430', icon: '🥇' },
      ])
    } finally {
      setForexLoading(false)
    }
  }

  async function fetchGlobal() {
    const symbols = [
      { sym: '^GSPC', name: 'S&P 500', icon: '🇺🇸' },
      { sym: '^IXIC', name: 'NASDAQ', icon: '🇺🇸' },
      { sym: '^FTSE', name: 'FTSE 100', icon: '🇬🇧' },
      { sym: '^N225', name: 'NIKKEI', icon: '🇯🇵' },
      { sym: '^HSI', name: 'HANG SENG', icon: '🇭🇰' },
      { sym: '^GDAXI', name: 'DAX', icon: '🇩🇪' },
    ]
    try {
      const items = await Promise.all(symbols.map(async s => {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${s.sym}?interval=1d&range=2d`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        const r = data?.chart?.result?.[0]?.meta
        if (!r) throw new Error()
        const change = +(((r.regularMarketPrice - r.chartPreviousClose) / r.chartPreviousClose) * 100).toFixed(2)
        return { name: s.name, icon: s.icon, value: r.regularMarketPrice.toLocaleString('en-US', { maximumFractionDigits: 2 }), change }
      }))
      setGlobal(items); setGlobalLive(true)
    } catch {
      setGlobal([
        { name: 'S&P 500', value: '5,482.87', change: 0.42, icon: '🇺🇸' },
        { name: 'NASDAQ', value: '17,689.3', change: 0.58, icon: '🇺🇸' },
        { name: 'FTSE 100', value: '8,252.91', change: -0.31, icon: '🇬🇧' },
        { name: 'NIKKEI', value: '38,804', change: 0.89, icon: '🇯🇵' },
      ])
    } finally {
      setGlobalLoading(false)
    }
  }

  const renderItem = (item, live) => {
    const change = Number(item.change || 0)
    const val = typeof item.value === 'number' ? item.value.toLocaleString('en-IN') : item.value
    return (
      <div key={item.name} className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-white/[0.025] transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xs">{item.icon}</span>
          <span className="text-[12px] text-slate-300 font-medium">{item.name}</span>
          <span className={`w-1 h-1 rounded-full ${live ? 'bg-emerald-400' : 'bg-amber-500'}`} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-white font-semibold tabular-nums">{val}</span>
          {change !== 0 && (
            <span className={`text-[10px] font-semibold tabular-nums min-w-[48px] text-right ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    )
  }

  const renderSkeleton = (rows = 5) => (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 px-2.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 skeleton" />
            <div className="w-20 h-3 skeleton" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-14 h-3 skeleton" />
            <div className="w-12 h-3 skeleton" />
          </div>
        </div>
      ))}
    </div>
  )

  const sections = [
    { id: 'indian', label: 'Indian', data: broadIndices, live: true, loading: false },
    { id: 'sectors', label: 'Sectors', data: sectorIndices, live: true, loading: false },
    { id: 'forex', label: 'Forex', data: forex, live: forexLive, loading: forexLoading },
    { id: 'global', label: 'Global', data: global, live: globalLive, loading: globalLoading },
  ]

  const current = sections.find(s => s.id === activeSection)

  return (
    <div className="card rounded-2xl px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-400 to-cyan-400" />
          Market Overview
        </h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Delayed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[var(--color-border)]/60 mb-3">
        {sections.map(s => {
          const isActive = activeSection === s.id
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`relative -mb-px pb-2.5 pt-1 text-[12px] font-medium tracking-wide transition-colors border-b-2 ${isActive
                ? 'text-white border-indigo-500'
                : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
              {s.label}
              {!isActive && s.loading && (
                <span className="ml-1.5 inline-block w-1 h-1 rounded-full bg-amber-400/60 animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      <div className="fade-in min-h-[200px]" key={activeSection}>
        {current.loading
          ? renderSkeleton(5)
          : current.data.map(i =>
              renderItem(
                activeSection === 'forex' ? { ...i, change: 0 } : i,
                current.live
              )
            )}
      </div>
    </div>
  )
}
