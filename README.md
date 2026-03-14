<div align = "center">

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>StockForecaster Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#1B4D89",
                        "primary-light": "#e8eff7",
                        "background-light": "#f8fafc",
                        "surface": "#ffffff",
                        "border-light": "#e2e8f0"
                    },
                    fontFamily: {
                        "display": ["Inter"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.375rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
    </style>
<style>
        body {
            min-height: max(884px, 100dvh);
        }
    </style>
</head>
<body class="bg-background-light text-slate-800 font-display">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<!-- Top Navigation & Search -->
<header class="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 pt-6 pb-4 border-b border-border-light">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-3">
<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
<span class="material-symbols-outlined text-primary font-bold">monitoring</span>
</div>
<h1 class="text-xl font-bold tracking-tight text-slate-900">StockForecaster</h1>
</div>
<div class="size-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
<span class="material-symbols-outlined text-slate-500">person</span>
</div>
</div>
<div class="relative">
<label class="flex items-center h-12 w-full bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
<span class="material-symbols-outlined ml-4 text-slate-400">search</span>
<input class="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm" placeholder="Search tickers (AAPL, NVDA, TSLA...)" type="text"/>
<span class="material-symbols-outlined mr-4 text-slate-400 text-sm">mic</span>
</label>
</div>
</header>
<main class="flex-1 px-4 pb-32 pt-6">
<!-- Prediction Status Card (Active Training) -->
<section class="mb-8">
<div class="flex items-center justify-between mb-3">
<h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">Prediction Status</h2>
<span class="text-[10px] bg-blue-100 text-primary px-2 py-0.5 rounded font-bold border border-blue-200">LIVE</span>
</div>
<div class="relative overflow-hidden rounded-2xl bg-surface border border-border-light p-5 shadow-sm">
<div class="absolute top-0 right-0 p-4">
<div class="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
</div>
<div class="flex flex-col gap-4">
<div class="flex items-center gap-4">
<div class="size-14 rounded-xl bg-slate-50 flex items-center justify-center border border-border-light">
<span class="text-lg font-bold text-slate-900">AAPL</span>
</div>
<div>
<h3 class="text-lg font-bold text-slate-900">Apple Inc.</h3>
<p class="text-sm text-slate-500">7-Day Price Forecast</p>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-xs font-semibold">
<span class="text-primary">Model Training in Progress...</span>
<span class="text-slate-700">65%</span>
</div>
<div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 65%"></div>
</div>
<p class="text-[11px] text-slate-400 italic">Estimated time remaining: ~2 mins</p>
</div>
<div class="pt-2">
<button class="w-full py-3 bg-white hover:bg-slate-50 text-primary border border-primary/30 rounded-lg text-sm font-bold transition-all shadow-sm">
                                View Partial Analytics
                            </button>
</div>
</div>
</div>
</section>
<!-- Recent Predictions Section -->
<section class="mb-8">
<div class="flex items-center justify-between mb-4">
<h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">Recent Predictions</h2>
<a class="text-primary text-xs font-bold hover:underline" href="#">View History</a>
</div>
<div class="space-y-3">
<!-- Prediction Item 1 -->
<div class="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-light shadow-sm">
<div class="flex items-center gap-3">
<div class="size-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-100">NVDA</div>
<div>
<p class="text-sm font-bold text-slate-900">Nvidia Corp</p>
<p class="text-[10px] text-slate-500">Predicted 4h ago</p>
</div>
</div>
<div class="text-right">
<p class="text-sm font-bold text-emerald-600">+4.2%</p>
<p class="text-[10px] text-slate-400 font-medium">Confidence: 92%</p>
</div>
</div>
<!-- Prediction Item 2 -->
<div class="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-light shadow-sm">
<div class="flex items-center gap-3">
<div class="size-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-100">TSLA</div>
<div>
<p class="text-sm font-bold text-slate-900">Tesla Inc</p>
<p class="text-[10px] text-slate-500">Predicted 12h ago</p>
</div>
</div>
<div class="text-right">
<p class="text-sm font-bold text-rose-600">-1.8%</p>
<p class="text-[10px] text-slate-400 font-medium">Confidence: 78%</p>
</div>
</div>
</div>
</section>
<!-- Market Insights Section -->
<section>
<div class="flex items-center justify-between mb-4">
<h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">Market Insights</h2>
<span class="material-symbols-outlined text-slate-400 text-sm">info</span>
</div>
<div class="grid grid-cols-2 gap-3">
<div class="p-4 rounded-2xl bg-white border border-border-light shadow-sm">
<span class="material-symbols-outlined text-primary mb-2">trending_up</span>
<p class="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Tech Sentiment</p>
<p class="text-lg font-bold text-slate-900">Bullish</p>
</div>
<div class="p-4 rounded-2xl bg-white border border-border-light shadow-sm">
<span class="material-symbols-outlined text-amber-500 mb-2">speed</span>
<p class="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Volatility Index</p>
<p class="text-lg font-bold text-slate-900">Moderate</p>
</div>
</div>
<div class="mt-4 p-4 rounded-2xl bg-white border border-border-light shadow-sm">
<div class="flex items-start gap-4">
<div class="w-20 h-20 rounded-lg bg-slate-100 flex-shrink-0 bg-cover bg-center border border-slate-200" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0GmjHjkTbIS3kKwOAEaVMIaXXOW2-e50oYaS9TyOhijCip2fStiY-980CPKWZ93iDWbTXwoJs_OuTkl2iNz1MhgdhEnezwV6M09Fcwir1c1DZvO8PbMBmByto4kwEWrHZsUwxCObQ_GjlsFJa_VfhK0GfnpMg5I182NerOgCer1suBl8A29HASoKzCNK8vy_5T8cS-Al57Jn5KjJWRY6miQ18VWewKbWuoBmYwIg_BALH6Vvm1L3Uv9rvotWyvRlFWAiobl6YaIY')"></div>
<div class="flex-1">
<p class="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">AI Insight</p>
<h4 class="text-sm font-bold leading-tight mb-2 text-slate-900">Semi-conductor sector showing divergence from S&amp;P 500 benchmarks.</h4>
<p class="text-[11px] text-slate-500 leading-relaxed">Deep-learning models suggest a potential breakout for mid-cap chips...</p>
</div>
</div>
</div>
</section>
</main>
<!-- New Forecast FAB -->
<div class="fixed bottom-24 right-4 z-30">
<button class="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-slate-800 transition-all active:scale-95">
<span class="material-symbols-outlined">add_chart</span>
<span>New Forecast</span>
</button>
</div>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-border-light bg-white px-4 pb-8 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
<div class="flex justify-around items-center max-w-md mx-auto">
<a class="flex flex-col items-center gap-1 text-primary" href="#">
<span class="material-symbols-outlined font-bold">grid_view</span>
<span class="text-[10px] font-bold">Home</span>
</a>
<a class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined">analytics</span>
<span class="text-[10px] font-medium">Portfolio</span>
</a>
<a class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined">explore</span>
<span class="text-[10px] font-medium">Discover</span>
</a>
<a class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="text-[10px] font-medium">Settings</span>
</a>
</div>
</nav>
</div>
</body></html>
  
</div>

&nbsp;

## Description

StockForecaster is a full-stack stock price prediction platform that uses LSTM neural networks to forecast prices 20 days into the future. The project consists of a Python/TensorFlow backend deployed as a serverless AWS Lambda function, accessible via a public REST API with authentication and rate limiting, and a Next.js/TypeScript frontend deployed to Vercel.

The machine learning model leverages TensorFlow and Keras to format historic stock prices into time series data for training a Long Short-Term Memory (LSTM) network. The model works best with predictions spanning 20 days and stock history of at least 1 year. Training uses 15 epochs with 64 batches each, following best practices from scientific literature to prevent overfitting.

&nbsp;

## Technical Stack

#### Backend 
> Python 3.11, TensorFlow 2.15, AWS Lambda (Docker containerized), API Gateway, DynamoDB  

#### Frontend 
> Next.js 14, TypeScript, React, Tailwind CSS (deployed to Vercel)

#### ML Model
> LSTM with 50 units, 20% dropout, custom weighted RMSE epoch selection (75% validation, 25% training)

#### Features 
> Async request/response pattern, VADER sentiment analysis, cold start retry logic

&nbsp;

## API Endpoints

#### POST /predict
> Submit prediction request (returns request_id immediately)

#### GET /status/{request_id}
> Poll for completion and retrieve results

_Note_: Model training takes 1-2 minutes but uses async architecture to avoid API Gateway timeout limits.

&nbsp;

## Reproducible results: Confirmation samples with accuracy score

Confirmation results following update of model epoch scoring formula (75% weighting on validation data)

#### Disclaimer of Results
> Data has been heavily cherrypicked. Forecasting works best on stable stocks with greater than or equal to 6 months of historical data. All claims of MAPE and accuracy are backtesting accuracy results and are not indicators of future performance or future model accuracy.

<div align = "center">

&nbsp;
  
#### Apple (AAPL) Prediction (0.41% MAPE)
##### April 24, 2024 Model Prediction: $169.02 &nbsp; — &nbsp; April 24, 2024 Actual Price: $169.71

</div>

- Training and validation data spanning January 1, 2023 to March 27, 2024 (20 trading days before April 24)
- Model forecasted 20-day price accuracy: 99.59% (pre Q1-earnings)

![Image](assets/AAPL_Sample_Output.png)

&nbsp;

<div align = "center">

#### Disney (DIS) Prediction (1.75% MAPE)
##### April 24, 2024 Model Prediction: $113.92 &nbsp; — &nbsp; April 24, 2024 Actual Price: $111.93

</div>

- Training and validation data spanning January 1, 2023 to March 27, 2024 (20 trading days before April 24)
- Model forecasted 20-day price accuracy: 98.25% (post Q1-earnings)

![Image](assets/DIS_Sample_Output.png)

&nbsp;

<div align = "center">

#### Oracle (ORCL) Prediction (6.98% MAPE)
##### April 24, 2024 Model Prediction: $115.34 &nbsp; — &nbsp; April 24, 2024 Actual Price: $123.39

</div>

- Training and validation data spanning January 1, 2023 to March 27, 2024 (20 trading days before April 24)
- Model forecasted 20-day price accuracy: 93.02% (post Q1-earnings)

![Image](assets/ORCL_Sample_Output.png)

&nbsp;

<div align = "center">

#### Alphabet/Google (GOOG) Prediction (4.46% MAPE)
##### April 24, 2024 Model Prediction: $161.10 &nbsp; — &nbsp; April 24, 2024 Actual Price: $153.92

</div>

- Training and validation data spanning January 1, 2023 to March 27, 2024 (20 trading days before April 24)
- Model forecasted 20-day price accuracy: 95.54% (pre Q1-earnings)

![Image](assets/GOOG_Sample_Output.png)
