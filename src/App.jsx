import { useState, useMemo } from 'react'
import { stockHoldings, mfHoldings, sectorColors } from './data/holdings'
import PortfolioSummary from './components/PortfolioSummary'
import SectorChart from './components/SectorChart'
import StockTable from './components/StockTable'
import MFTable from './components/MFTable'
import LiveTicker from './components/LiveTicker'
import TopMovers from './components/TopMovers'

import MarketSummary from './components/MarketSummary'
import RiskAnalysis from './components/RiskAnalysis'

export default function App() {
  const [activeTab, setActiveTab] = useState('stocks')
  const [sectorFilter, setSectorFilter] = useState('All')

  const stats = useMemo(() => {
    const totalInvested = stockHoldings.reduce((s, h) => s + h.avgPrice * h.qty, 0)
    const totalCurrent = stockHoldings.reduce((s, h) => s + h.ltp * h.qty, 0)
    const totalPnl = totalCurrent - totalInvested
    const totalPnlPct = (totalPnl / totalInvested) * 100
    const mfInvested = mfHoldings.reduce((s, h) => s + h.avgPrice * h.qty, 0)
    const mfCurrent = mfHoldings.reduce((s, h) => s + h.ltp * h.qty, 0)
    const mfPnl = mfCurrent - mfInvested
    const mfPnlPct = (mfPnl / mfInvested) * 100
    const todayPnl = stockHoldings.reduce((s, h) => s + (h.ltp - h.closePrice) * h.qty, 0)
    const totalPortfolio = totalCurrent + mfCurrent
    const todayPnlPct = (todayPnl / totalPortfolio) * 100
    return {
      totalInvested, totalCurrent, totalPnl, totalPnlPct,
      mfInvested, mfCurrent, mfPnl, mfPnlPct,
      todayPnl, todayPnlPct, totalPortfolio,
    }
  }, [])

  const sectorData = useMemo(() => {
    const map = {}
    stockHoldings.forEach(h => { map[h.sector] = (map[h.sector] || 0) + h.ltp * h.qty })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value), color: sectorColors[name] || '#64748b' }))
      .sort((a, b) => b.value - a.value)
  }, [])

  const handleSectorClick = (sector) => {
    setSectorFilter(prev => prev === sector ? 'All' : sector)
    setActiveTab('stocks')
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex justify-center">
      <div className="w-full max-w-[1320px] px-6 sm:px-10 lg:px-14" style={{ paddingTop: '72px', paddingBottom: '56px' }}>

        {/* Header */}
        <header className="fade-up" style={{ animationDelay: '0ms' }}>
          <div className="relative">
            <div className="absolute top-0 right-0 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full card">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium tracking-wide">Markets Open</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/30">₹</div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Portfolio <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wide">
                Sundararajan Naveen · TK6149 · {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>
          </div>
        </header>

        {/* Spacer: header → tiles */}
        <div style={{ height: '48px' }} />

        {/* Summary Cards */}
        <section className="fade-up" style={{ animationDelay: '80ms' }}>
          <PortfolioSummary stats={stats} />
        </section>

        {/* Spacer: tiles → main content */}
        <div style={{ height: '56px' }} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Holdings Table */}
          <div className="lg:col-span-7 space-y-6 fade-up" style={{ animationDelay: '160ms' }}>
            <div className="flex items-center gap-6 border-b border-[var(--color-border)]/60 pb-1">
              {['stocks', 'mutualfunds'].map(tab => {
                const isActive = activeTab === tab
                const count = tab === 'stocks' ? stockHoldings.length : mfHoldings.length
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`relative -mb-px pb-3 pt-1 text-[15px] font-semibold tracking-wide transition-colors border-b-2 ${isActive
                      ? 'text-white border-indigo-500'
                      : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
                    {tab === 'stocks' ? 'Stocks' : 'Mutual Funds'}
                    <span className={`ml-2 text-[12px] tabular-nums ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
            {activeTab === 'stocks'
              ? <StockTable sectorFilter={sectorFilter} setSectorFilter={setSectorFilter} />
              : <MFTable />}
          </div>

          {/* Right Sidebar — each section has explicit spacing */}
          <div className="lg:col-span-5 fade-up" style={{ animationDelay: '220ms' }}>
            <div><LiveTicker /></div>
            <div style={{ height: '48px' }} />
            <div><SectorChart data={sectorData} activeSector={sectorFilter} onSectorClick={handleSectorClick} /></div>
            <div style={{ height: '48px' }} />
            <div><TopMovers /></div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: '64px' }} />

        {/* Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-up" style={{ animationDelay: '450ms' }}>
          <MarketSummary />
          <RiskAnalysis />
        </div>

        <div style={{ height: '64px' }} />
        <footer className="pt-8 border-t border-[var(--color-border)] text-center fade-in" style={{ animationDelay: '550ms' }}>
          <p className="text-[11px] text-slate-600">Powered by Kite MCP • Live data from Yahoo Finance & ExchangeRate API</p>
          <p className="text-[11px] text-slate-600">Made by Naveen Sundararajan</p>
        </footer>
      </div>
    </div>
  )
}
