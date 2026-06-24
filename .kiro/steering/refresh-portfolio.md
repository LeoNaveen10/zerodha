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
