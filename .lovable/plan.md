

## StockPulse — React Frontend + Python Backend

A Bloomberg-terminal-vibe rebuild of your Streamlit app: **React (TanStack Start) frontend** in this Lovable project + a **separate FastAPI Python backend** that wraps your existing `yfinance` logic. Frontend calls the Python API for live quotes and candles.

### Architecture

```text
┌─────────────────────────────┐         ┌──────────────────────────┐
│  React (this Lovable app)   │ HTTPS   │  FastAPI (you host)      │
│  - Bloomberg dark UI        │ ──────▶ │  /api/quote?ticker=...   │
│  - Live charts (Recharts)   │         │  /api/candles?...        │
│  - Watchlist / Alerts /     │ ◀────── │  /api/quotes?tickers=... │
│    Portfolio / Compare      │  JSON   │  (wraps yfinance)        │
└─────────────────────────────┘         └──────────────────────────┘
```

The Python backend keeps your fetchers (`fetch_quote`, `fetch_candles`) intact — just exposed as JSON endpoints instead of Streamlit calls.

### What I'll build (frontend, in this project)

**Routes**
- `/` — Main terminal: header + OHLCV strip + chart + tab bar
- `/alerts` — Price alerts manager
- `/portfolio` — Holdings + P/L table
- `/compare` — Multi-ticker normalized % chart

**Components** (`src/components/stockpulse/`)
- `MarketStatusBar` — NSE/US open/closed pulsing dots, IST/EST clocks
- `Sidebar` — Watchlist with add/remove, neon-glow active state, hover slide
- `PriceHeader` — Big price, animated tick-flash on update, scanline sweep, glow border (green up / red down)
- `OHLCVStrip` — 5 cells (Open/High/Low/Prev Close/Vol) with hover lift
- `PriceChart` — Recharts line/candle/volume with theme palette, MA20/MA50, prev-close ref line
- `CompareChart` — Normalized % series, multi-color
- `AlertsPanel` — Add alert form + list with above/below badges, toast on trigger
- `PortfolioPanel` — Holdings table with computed P/L, summary cards
- `TabBar` — Glowing active tab, count badges

**Live feel (the "alive" part)**
- Auto-refresh every 15s via TanStack Query `refetchInterval`
- Animated grid backdrop (CSS `background-position` keyframe drift)
- Scanline sweep across price header
- Price number CRT-flicker + tick-in animation on each new value
- Pulsing market-open dots with expanding glow
- Neon hover (translate + box-shadow) on every interactive element
- Staggered fade-in for OHLCV/summary cards
- Gradient border around chart, brightens on hover
- `sonner` toasts when alerts fire
- Persist watchlist / alerts / portfolio in `localStorage`

**Design tokens** (added to `src/styles.css`)
- Bloomberg palette: `--bg` `#0a0e1a`, `--panel` `#0f1526`, `--border` `#1c2540`, `--green` `#26a69a`, `--red` `#ef5350`, `--blue` `#3d8ef8`, `--text-dim` `#6b7a99`
- Fonts: DM Sans (UI) + JetBrains Mono (numbers)
- Keyframes: `neonPulse`, `neonPulseRed`, `scanline`, `flicker`, `priceTick`, `gridDrift`, `glowDot`, `fadeUp`

**Configuration**
- `VITE_STOCKPULSE_API` env var pointing to your Python backend URL
- Fallback: if env var unset, show a banner with setup instructions and render with mock data so the UI is still alive

### What I'll deliver for the Python backend

A single `backend/main.py` (FastAPI) you run separately with `uvicorn main:app --reload`, plus `requirements.txt`:

```python
# Endpoints
GET /api/quote?ticker=AAPL          → { price, open, high, low, prev_close, volume, change, change_pct, currency }
GET /api/quotes?tickers=AAPL,TCS.NS → { "AAPL": {...}, "TCS.NS": {...} }
GET /api/candles?ticker=AAPL&period=1D → [{ time, open, high, low, close, volume }, ...]
```

Wraps your existing `fetch_quote` / `fetch_candles` (same `yfinance` calls, same period_map, same 3-attempt retry, tz-stripping). Adds CORS so the Lovable preview can call it.

I can't host the Python part for you — it needs to run somewhere `yfinance` is allowed (your machine, Render, Railway, Fly.io, a VPS). I'll include a 4-line deploy guide.

### Out of scope for this turn

- Hosting the Python backend (you run it)
- Authentication / multi-user accounts
- Real broker integration

### Files I'll create

**Frontend:**
- `src/styles.css` — Bloomberg theme tokens + keyframes (edit existing)
- `src/routes/__root.tsx` — Add QueryClientProvider, animated grid backdrop, sidebar layout (edit existing)
- `src/routes/index.tsx` — Replace placeholder, render terminal with default `/` = Chart tab (edit existing)
- `src/routes/alerts.tsx`, `src/routes/portfolio.tsx`, `src/routes/compare.tsx` — New routes
- `src/components/stockpulse/*.tsx` — Components listed above
- `src/lib/stockpulse/api.ts` — Fetch wrappers + TanStack Query hooks
- `src/lib/stockpulse/storage.ts` — localStorage persistence
- `src/lib/stockpulse/types.ts` — Shared types
- `src/lib/stockpulse/mock.ts` — Mock data when backend offline
- `src/router.tsx` — Wire QueryClient into context (edit existing)

**Backend (delivered as files in `backend/`, not deployed):**
- `backend/main.py` — FastAPI app
- `backend/requirements.txt` — fastapi, uvicorn, yfinance, pandas, pytz
- `backend/README.md` — Run + deploy instructions

### Dependencies to add

`@tanstack/react-query`, `recharts`, `sonner`, `lucide-react`, `date-fns`, `clsx` (most likely already present — will check before installing).

