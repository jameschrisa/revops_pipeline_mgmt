import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950 text-white">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 font-heading text-sm font-bold text-navy-950">
            F3
          </span>
          <span className="font-heading font-semibold">F3 Pipeline Intelligence</span>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-navy-700 px-4 py-2 text-sm text-navy-100 transition-colors hover:border-gold-400 hover:text-gold-300"
        >
          Sign in
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="font-data text-xs uppercase tracking-[0.25em] text-gold-400">
          Predictive Pipeline Analytics
        </p>
        <h1 className="mt-5 max-w-3xl font-heading text-5xl font-bold leading-tight">
          Know your number before the quarter knows it for you.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">
          F3 Pipeline Intelligence analyzes your CRM&apos;s conversion history, deal velocity,
          and activity patterns to score every deal, forecast three scenarios, and flag
          stalling deals — hours after they drift, not weeks.
        </p>
        <div className="mt-9 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gold-500 px-6 py-3 font-medium text-navy-950 transition-colors hover:bg-gold-400"
          >
            Enter demo workspace →
          </Link>
          <a
            href="/api/health"
            className="rounded-lg border border-navy-700 px-6 py-3 text-navy-200 transition-colors hover:border-navy-500"
          >
            API health
          </a>
        </div>
        <div className="mt-16 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {[
            ["Deal health scoring", "Explainable 0–100 scores from your own conversion history — no black-box AI."],
            ["Three-scenario forecasts", "Commit, most likely, and best case — segmented by team, product, and region."],
            ["Slippage alerts", "Inactivity, missed close dates, and stage stalls surfaced within hours."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-navy-800 bg-navy-900/60 p-5">
              <h3 className="font-heading font-semibold text-gold-300">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">{body}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="px-8 py-6 text-center text-xs text-navy-400">
        F3 Insights · Demo workspace populated with synthetic data · No CRM connection required
      </footer>
    </div>
  );
}
