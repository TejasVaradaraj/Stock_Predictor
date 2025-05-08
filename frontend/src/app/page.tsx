'use client';

import { useState, useEffect, useRef } from 'react';
import { submitPrediction, checkStatus } from '@/lib/api';
import type { PredictionResponse, StatusResponse } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentPrediction {
  ticker: string;
  companyName: string;
  predictedChange: string;
  accuracy: string;
  timestamp: string;
  result: StatusResponse;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getCompanyName(ticker: string): string {
  const names: Record<string, string> = {
    AAPL: 'Apple Inc.',
    NVDA: 'Nvidia Corp',
    TSLA: 'Tesla Inc.',
    GOOGL: 'Alphabet Inc.',
    GOOG: 'Alphabet Inc.',
    MSFT: 'Microsoft Corp',
    AMZN: 'Amazon.com Inc.',
    META: 'Meta Platforms',
    NFLX: 'Netflix Inc.',
    ORCL: 'Oracle Corp',
    AMD: 'Advanced Micro Devices',
    INTC: 'Intel Corp',
    DIS: 'Walt Disney Co.',
    UBER: 'Uber Technologies',
    SPOT: 'Spotify Technology',
    COIN: 'Coinbase Global',
    PLTR: 'Palantir Technologies',
  };
  return names[ticker.toUpperCase()] ?? ticker;
}

function getSentimentLabel(val: number): string {
  if (val > 0.15) return 'Very Bullish';
  if (val > 0.05) return 'Bullish';
  if (val > -0.05) return 'Neutral';
  if (val > -0.15) return 'Bearish';
  return 'Very Bearish';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className ?? ''}`}>
      {name}
    </span>
  );
}

function BottomNav({
  active,
  onNav,
}: {
  active: 'home' | 'portfolio' | 'discover' | 'settings';
  onNav: (tab: 'home' | 'portfolio' | 'discover' | 'settings') => void;
}) {
  const tabs = [
    { id: 'home' as const, icon: 'grid_view', label: 'Home' },
    { id: 'portfolio' as const, icon: 'analytics', label: 'Portfolio' },
    { id: 'discover' as const, icon: 'explore', label: 'Discover' },
    { id: 'settings' as const, icon: 'settings', label: 'Settings' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e2e8f0] bg-white px-4 pb-8 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              active === t.id
                ? 'text-[#1B4D89]'
                : 'text-slate-400 hover:text-[#1B4D89]'
            }`}
          >
            <Icon
              name={t.icon}
              className={active === t.id ? 'font-bold' : ''}
            />
            <span
              className={`text-[10px] ${active === t.id ? 'font-bold' : 'font-medium'}`}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── New Forecast Modal ────────────────────────────────────────────────────────

function NewForecastModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: {
    ticker: string;
    startDate: string;
    endDate: string;
    includeSentiment: boolean;
  }) => void;
  isLoading: boolean;
}) {
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');
  const [includeSentiment, setIncludeSentiment] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">New Forecast</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Icon name="close" className="text-slate-500 text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Ticker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Stock Ticker
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="AAPL"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D89]/20 focus:border-[#1B4D89] transition-all"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D89]/20 focus:border-[#1B4D89] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D89]/20 focus:border-[#1B4D89] transition-all"
                required
              />
            </div>
          </div>

          {/* Sentiment Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Sentiment Analysis
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Scrape & score recent news headlines
              </p>
            </div>
            <button
              onClick={() => setIncludeSentiment((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                includeSentiment ? 'bg-[#1B4D89]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  includeSentiment ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={() =>
              onSubmit({ ticker, startDate, endDate, includeSentiment })
            }
            disabled={isLoading}
            className="w-full py-4 bg-[#1B4D89] hover:bg-[#153d6e] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors duration-200 text-sm shadow-lg shadow-[#1B4D89]/20"
          >
            {isLoading ? 'Submitting...' : 'Run Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Result Detail Modal ───────────────────────────────────────────────────────

function ResultModal({
  result,
  onClose,
}: {
  result: StatusResponse;
  onClose: () => void;
}) {
  const r = result.result!;
  const change = parseFloat(r.prediction.predicted_change_20d);
  const isPositive = change >= 0;
  const sentiment = r.sentiment
    ? parseFloat(r.sentiment.average_sentiment)
    : null;
  const accuracy = (100 - parseFloat(r.model_performance.mape)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {r.ticker} Forecast
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {r.date_range.start} → {r.date_range.end}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Icon name="close" className="text-slate-500 text-lg" />
          </button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">
              Current Price
            </p>
            <p className="text-xl font-bold text-slate-900">
              {r.prediction.current_price}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">
              20-Day Target
            </p>
            <p className="text-xl font-bold text-slate-900">
              {r.prediction.predicted_price_20d}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">
              Expected Change
            </p>
            <p
              className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {isPositive ? '+' : ''}
              {r.prediction.predicted_change_20d}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">
              Model Accuracy
            </p>
            <p className="text-xl font-bold text-slate-900">{accuracy}%</p>
          </div>
        </div>

        {/* Sentiment */}
        {sentiment !== null && (
          <div className="p-4 rounded-2xl bg-[#e8eff7] border border-[#1B4D89]/20 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#1B4D89] uppercase font-bold tracking-tight mb-1">
                  News Sentiment
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {getSentimentLabel(sentiment)}
                </p>
              </div>
              <p
                className={`text-2xl font-bold ${sentiment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {(sentiment * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Headlines */}
        {r.sentiment?.news_headlines && r.sentiment.news_headlines.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Top Headlines
            </h3>
            <div className="space-y-2">
              {r.sentiment.news_headlines.map((h, i) => {
                const s = parseFloat(h.sentiment);
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <span
                      className={`text-xs font-bold mt-0.5 min-w-[36px] text-center px-1.5 py-0.5 rounded ${
                        s > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : s < 0
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {h.datetime}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed flex-1">
                      {h.headline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-2">
            Forecast Timeline
          </p>
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="font-bold text-slate-900">
                {r.forecast_timeline.historical_days}
              </p>
              <p className="text-[10px] text-slate-500">Training Days</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900">
                {r.forecast_timeline.forecast_days}
              </p>
              <p className="text-[10px] text-slate-500">Forecast Days</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900">
                {r.forecast_timeline.total_days}
              </p>
              <p className="text-[10px] text-slate-500">Total Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  // ── Nav state ──
  const [activeTab, setActiveTab] = useState<
    'home' | 'portfolio' | 'discover' | 'settings'
  >('home');

  // ── Modal state ──
  const [showNewForecast, setShowNewForecast] = useState(false);
  const [selectedResult, setSelectedResult] = useState<StatusResponse | null>(
    null
  );

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState('');

  // ── Active prediction (in-progress job) ──
  const [activePrediction, setActivePrediction] = useState<{
    ticker: string;
    requestId: string;
    status: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── History of completed predictions ──
  const [recentPredictions, setRecentPredictions] = useState<
    RecentPrediction[]
  >([]);

  // ── Polling ref ──
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Submit handler ──
  const handleSubmit = async (data: {
    ticker: string;
    startDate: string;
    endDate: string;
    includeSentiment: boolean;
  }) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const MAX_ATTEMPTS = 2;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response: PredictionResponse = await submitPrediction({
          ticker: data.ticker,
          start_date: data.startDate,
          end_date: data.endDate,
          include_sentiment: data.includeSentiment,
        });

        setActivePrediction({
          ticker: data.ticker,
          requestId: response.request_id,
          status: 'PENDING',
        });
        setShowNewForecast(false);
        setIsSubmitting(false);
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isTimeout =
          msg.includes('timeout') ||
          msg.includes('504') ||
          msg.includes('Gateway');

        if (attempt >= MAX_ATTEMPTS || !isTimeout) {
          setIsSubmitting(false);
          setSubmitError(msg);
          return;
        }
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };

  // ── Polling ──
  useEffect(() => {
    if (!activePrediction?.requestId) return;
    if (
      activePrediction.status === 'COMPLETED' ||
      activePrediction.status === 'FAILED'
    )
      return;

    let pollCount = 0;
    const MAX_POLLS = 40; // 40 × 3s = 2 min

    const poll = async () => {
      pollCount++;
      if (pollCount > MAX_POLLS) {
        clearInterval(pollRef.current!);
        setActivePrediction(null);
        setSubmitError('Prediction timed out. Try a shorter date range.');
        return;
      }

      try {
        const res = await checkStatus(activePrediction.requestId);

        if (res.status === 'COMPLETED') {
          clearInterval(pollRef.current!);

          const change = res.result?.prediction.predicted_change_20d ?? '0%';
          const accuracy = res.result
            ? (100 - parseFloat(res.result.model_performance.mape)).toFixed(1) +
              '%'
            : 'N/A';

          setRecentPredictions((prev) => [
            {
              ticker: activePrediction.ticker,
              companyName: getCompanyName(activePrediction.ticker),
              predictedChange: change,
              accuracy,
              timestamp: new Date().toISOString(),
              result: res,
            },
            ...prev,
          ]);
          setActivePrediction(null);
        } else if (res.status === 'FAILED') {
          clearInterval(pollRef.current!);
          setSubmitError(
            'Prediction failed. Try a longer date range (6+ months).'
          );
          setActivePrediction(null);
        } else {
          setActivePrediction((prev) =>
            prev ? { ...prev, status: res.status } : prev
          );
        }
      } catch {
        clearInterval(pollRef.current!);
        setActivePrediction(null);
        setSubmitError('Lost connection while polling. Please try again.');
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activePrediction?.requestId]);

  // ── Filtered predictions for search ──
  const filtered = searchQuery
    ? recentPredictions.filter((p) =>
        p.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentPredictions;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] text-slate-800">

        {/* ── Header ── */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 pt-6 pb-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#1B4D89]/10 flex items-center justify-center border border-[#1B4D89]/20">
                <Icon name="monitoring" className="text-[#1B4D89] font-bold" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                StockForecaster
              </h1>
            </div>
            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <Icon name="person" className="text-slate-500" />
            </div>
          </div>

          {/* Search */}
          <label className="flex items-center h-12 w-full bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#1B4D89] focus-within:ring-1 focus-within:ring-[#1B4D89]/20 transition-all">
            <Icon name="search" className="ml-4 text-slate-400" />
            <input
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm px-3"
              placeholder="Search tickers (AAPL, NVDA, TSLA...)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon name="mic" className="mr-4 text-slate-400 text-sm" />
          </label>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 px-4 pb-32 pt-6">

          {/* Error Banner */}
          {submitError && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <Icon name="error" className="text-rose-500 text-lg mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800">Error</p>
                <p className="text-xs text-rose-600 mt-0.5">{submitError}</p>
              </div>
              <button onClick={() => setSubmitError(null)}>
                <Icon name="close" className="text-rose-400 text-lg" />
              </button>
            </div>
          )}

          {/* ── Active Prediction Card ── */}
          {activePrediction && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Prediction Status
                </h2>
                <span className="text-[10px] bg-blue-100 text-[#1B4D89] px-2 py-0.5 rounded font-bold border border-blue-200">
                  LIVE
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] p-5 shadow-sm">
                <div className="absolute top-0 right-0 p-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1B4D89] border-t-transparent" />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-slate-50 flex items-center justify-center border border-[#e2e8f0]">
                      <span className="text-lg font-bold text-slate-900">
                        {activePrediction.ticker}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {getCompanyName(activePrediction.ticker)}
                      </h3>
                      <p className="text-sm text-slate-500">
                        20-Day Price Forecast
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1B4D89]">
                        {activePrediction.status === 'PENDING'
                          ? 'Queuing request...'
                          : 'Model Training in Progress...'}
                      </span>
                      <span className="text-slate-700">
                        {activePrediction.status === 'PENDING' ? '10%' : '65%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#1B4D89] h-full rounded-full transition-all duration-500"
                        style={{
                          width:
                            activePrediction.status === 'PENDING'
                              ? '10%'
                              : '65%',
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Estimated time remaining: ~1-2 mins
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Recent Predictions ── */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Recent Predictions
              </h2>
              {recentPredictions.length > 3 && (
                <button className="text-[#1B4D89] text-xs font-bold hover:underline">
                  View History
                </button>
              )}
            </div>

            {filtered.length === 0 && !activePrediction ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-16 rounded-2xl bg-[#1B4D89]/10 flex items-center justify-center mb-4">
                  <Icon name="add_chart" className="text-[#1B4D89] text-3xl" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  No forecasts yet
                </p>
                <p className="text-xs text-slate-400">
                  Tap &quot;New Forecast&quot; to run your first LSTM prediction
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p, i) => {
                  const change = parseFloat(p.predictedChange);
                  const isPos = change >= 0;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedResult(p.result)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:border-[#1B4D89]/30 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-100">
                          {p.ticker}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {p.companyName}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Predicted {timeAgo(p.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}
                        >
                          {isPos ? '+' : ''}
                          {p.predictedChange}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Accuracy: {p.accuracy}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Market Insights ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Market Insights
              </h2>
              <Icon name="info" className="text-slate-400 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
                <Icon name="trending_up" className="text-[#1B4D89] mb-2" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                  Tech Sentiment
                </p>
                <p className="text-lg font-bold text-slate-900">Bullish</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
                <Icon name="speed" className="text-amber-500 mb-2" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                  Volatility Index
                </p>
                <p className="text-lg font-bold text-slate-900">Moderate</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-100 flex-shrink-0 bg-cover bg-center border border-slate-200" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#1B4D89] mb-1 uppercase tracking-wider">
                    AI Insight
                  </p>
                  <h4 className="text-sm font-bold leading-tight mb-2 text-slate-900">
                    Semi-conductor sector showing divergence from S&amp;P 500
                    benchmarks.
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Deep-learning models suggest a potential breakout for
                    mid-cap chips...
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FAB ── */}
        <div className="fixed bottom-24 right-4 z-30">
          <button
            onClick={() => setShowNewForecast(true)}
            className="flex items-center gap-2 px-6 py-4 bg-[#1B4D89] text-white rounded-full font-bold shadow-lg shadow-[#1B4D89]/30 hover:bg-[#153d6e] transition-all active:scale-95"
          >
            <Icon name="add_chart" />
            <span>New Forecast</span>
          </button>
        </div>

        {/* ── Bottom Nav ── */}
        <BottomNav active={activeTab} onNav={setActiveTab} />
      </div>

      {/* ── Modals ── */}
      {showNewForecast && (
        <NewForecastModal
          onClose={() => {
            setShowNewForecast(false);
            setIsSubmitting(false);
          }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}

      {selectedResult && (
        <ResultModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
}
