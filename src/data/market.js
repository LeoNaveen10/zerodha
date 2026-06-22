// Pre-fetched from Kite API
// Last updated: 2026-06-22T14:24:16+05:30
// Format: {name, value, close, change} - change is calculated from (value-close)/close*100

const calc = (price, close) => +(((price - close) / close) * 100).toFixed(2)

export const broadIndices = [
  { name: "NIFTY 50",        value: 24123.35, close: 24013.10, change: calc(24123.35, 24013.10), icon: "📈" },
  { name: "SENSEX",          value: 77184.19, close: 76802.90, change: calc(77184.19, 76802.90), icon: "📊" },
  { name: "NIFTY NEXT 50",   value: 72594.45, close: 72356.65, change: calc(72594.45, 72356.65), icon: "🎯" },
  { name: "NIFTY MIDCAP 100", value: 62705.15, close: 62517.30, change: calc(62705.15, 62517.30), icon: "📍" },
  { name: "NIFTY SMLCAP 100", value: 18890.90, close: 18784.45, change: calc(18890.90, 18784.45), icon: "🔬" },
  { name: "INDIA VIX",       value: 12.81,    close: 12.97,    change: calc(12.81, 12.97),       icon: "⚡" },
]

export const sectorIndices = [
  { name: "BANK NIFTY",       value: 57896.50, close: 57685.75, change: calc(57896.50, 57685.75), icon: "🏦" },
  { name: "NIFTY IT",         value: 27733.75, close: 27426.85, change: calc(27733.75, 27426.85), icon: "💻" },
  { name: "NIFTY AUTO",       value: 26751.40, close: 26583.35, change: calc(26751.40, 26583.35), icon: "🚗" },
  { name: "NIFTY METAL",      value: 13015.45, close: 13020.80, change: calc(13015.45, 13020.80), icon: "⛏️" },
  { name: "NIFTY PHARMA",     value: 24736.55, close: 24460.30, change: calc(24736.55, 24460.30), icon: "💊" },
  { name: "NIFTY FMCG",       value: 49303.95, close: 49558.70, change: calc(49303.95, 49558.70), icon: "🛒" },
  { name: "NIFTY ENERGY",     value: 40652.20, close: 40548.10, change: calc(40652.20, 40548.10), icon: "⚡" },
  { name: "NIFTY FIN SERVICE", value: 26558.20, close: 26431.15, change: calc(26558.20, 26431.15), icon: "💼" },
]

// Backwards-compat for any existing imports
export const indianIndices = [...broadIndices, ...sectorIndices]
