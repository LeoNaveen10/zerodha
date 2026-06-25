# Refresh Portfolio Data

1. Login to Kite MCP (show the auth link, wait for user to confirm)
2. Fetch user profile via Kite `get_profile` and write to `src/data/profile.js`:
```js
// Fetched from Kite API on {ISO timestamp}
export const userProfile = {
  userName: "{user_name}",
  userId: "{user_id}",
  email: "{email}",
  broker: "{broker}",
};
```
3. Fetch stock holdings via Kite `get_holdings`
4. Fetch MF holdings via Kite `get_mf_holdings`
5. Fetch live quotes via `get_quotes` for LTP and day change
6. Write updated data to `src/data/holdings.js` in the existing format
7. Preserve sectorColors and mfCategoryColors exports unchanged
8. Keep the sector mapping for each stock the same
9. Update: qty, avgPrice, ltp, closePrice, pnl, dayChange
10. Add timestamp comment at top of file

## Today's Buy Suggestion (market-open days only)

11. Do a web search to check if Indian stock market (NSE/BSE) is open today
12. If market is CLOSED today (weekend/holiday): set `todaysBuy = null` in `src/data/todaysBuy.js` and skip to step 19
13. If market is OPEN: ask the user "How much are you willing to invest today?" and wait for their response (₹ amount)
14. Analyze sector allocation from the freshly updated holdings — identify underweight sectors
15. Identify stocks already held trading at attractive levels (below avg price or near support)
16. **MANDATORY**: Do web search for each stock being considered — find analyst ratings, target prices, recent news, and any disqualifying negative news. Never suggest a stock without web-searching it first.
17. Prioritize: underweight sector > already held (averaging down) > bullish analyst consensus > attractive price
18. Write suggestions to `src/data/todaysBuy.js` in this format:

```js
// Generated on {ISO timestamp}
export const todaysBuy = {
  budget: {amount},
  date: "{YYYY-MM-DD}",
  suggestions: [
    {
      symbol: "SYMBOL",
      exchange: "NSE/BSE",
      sector: "Sector",
      ltp: 123.45,
      qty: 1,
      cost: 123.45,
      reason: "Brief reason why this is a good buy today",
      analystTarget: 150.00,
      upside: "21.5%",
    },
  ],
  totalCost: 123.45,
  remainingBudget: 1376.55,
  rationale: "One-line overall portfolio diversification rationale",
};
```

- Max 3 stocks, prioritize quality over quantity
- Can suggest any stock (existing or new) that fits the diversification and long-term thesis
- Must afford at least 1 share within budget

19. Run the React app with `npm run dev` and return the localhost URL to the user

## Sell Alerts

20. For each stock in the updated holdings, check if:
    - Current price has hit or exceeded analyst target price (profit booking opportunity)
    - Stock is down more than 15% from average cost (potential cut-loss)
    - Any recent negative news (governance issues, downgrades, earnings miss)
21. **MANDATORY**: Do web search for any stock that triggers the above — confirm with recent analyst opinion. Never flag a stock without web-searching it first.
22. Write alerts to `src/data/sellAlerts.js` in this format (or set `sellAlerts = null` if none):

```js
// Generated on {ISO timestamp}
export const sellAlerts = {
  date: "{YYYY-MM-DD}",
  alerts: [
    {
      symbol: "SYMBOL",
      sector: "Sector",
      severity: "high", // "high" or "medium"
      reason: "Brief explanation why this stock needs attention",
    },
  ],
};
```

- severity "high" = strong sell signal (target hit, major bad news)
- severity "medium" = watch closely (approaching target, minor concerns)
- Max 5 alerts, only flag genuinely concerning positions

## Stock Ideas (outside portfolio)

23. Research 2-3 short-term stock ideas (1-3 month horizon) — look for momentum plays, technical breakouts, upcoming catalysts, sector rotation opportunities
24. Research 2-3 long-term stock ideas (1+ year horizon) — look for undervalued quality names, strong fundamentals, sector tailwinds, beaten-down blue chips
25. **MANDATORY**: Candidates must NOT be in the user's current portfolio. Web search each candidate for analyst consensus, recent news, and red flags. Never suggest without verification.
26. Write suggestions to `src/data/stockIdeas.js` in this format (or set `stockIdeas = null` if unable to find quality ideas):

```js
// Generated on {ISO timestamp}
export const stockIdeas = {
  date: "{YYYY-MM-DD}",
  shortTerm: [
    {
      symbol: "SYMBOL",
      exchange: "NSE/BSE",
      sector: "Sector",
      ltp: 123.45,
      analystTarget: 150.00,
      upside: "21.5%",
      conviction: "high", // "high" or "medium"
      timeframe: "1-3 months",
      thesis: "Brief reason — catalyst, breakout level, momentum signal",
    },
  ],
  longTerm: [
    {
      symbol: "SYMBOL",
      exchange: "NSE/BSE",
      sector: "Sector",
      ltp: 123.45,
      analystTarget: 200.00,
      upside: "62%",
      conviction: "high",
      timeframe: "1+ year",
      thesis: "Brief reason — valuation, growth runway, sector tailwind",
    },
  ],
};
```

- Max 3 per category, prioritize quality and conviction
- Short-term: momentum, breakouts, event-driven catalysts
- Long-term: undervalued quality, compounders, secular growth themes

## Portfolio Health Score

27. After completing all the above steps, compute a Portfolio Health Score (0-100) by analyzing:
    - **Diversification** (0-100): number of stocks, concentration in top holdings
    - **Sector Concentration** (0-100): sector weights vs ideal 20-25% max per sector
    - **Analyst Alignment** (0-100): what % of holdings have Buy/Strong Buy consensus
    - **Risk Factors** (0-100): small-cap exposure, drawdowns from cost, volatility
28. Compute the overall score as a weighted average (equal weights) of the 4 factors
29. Write to `src/data/portfolioHealth.js` in this format (or set `portfolioHealth = null` if data is insufficient):

```js
// Generated on {ISO timestamp}
export const portfolioHealth = {
  date: "{YYYY-MM-DD}",
  score: 72,
  breakdown: [
    { factor: "Diversification", score: 75, comment: "Brief explanation of score" },
    { factor: "Sector Concentration", score: 65, comment: "Brief explanation of score" },
    { factor: "Analyst Alignment", score: 78, comment: "Brief explanation of score" },
    { factor: "Risk Factors", score: 70, comment: "Brief explanation of score" },
  ],
  summary: "One-line actionable summary of portfolio health and top improvement suggestion.",
};
```

- Be honest and critical — don't inflate scores
- Comments should be specific to the user's actual portfolio (mention stock names, sectors, percentages)
- Summary should give one clear, actionable improvement suggestion
