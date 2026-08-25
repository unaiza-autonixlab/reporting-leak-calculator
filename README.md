# The Reporting Leak Audit

A free tool for DTC marketing agencies: paste your client roster, instantly see which accounts need attention this week, and get a client-ready update written for the ones that do.

**Live tool:** https://reporting-leak-calculator.vercel.app

---

## The problem

Agencies running 5–15 DTC clients lose real hours every week to a task that isn't analysis, it's just checking. Log into each platform, compare this period to last, decide what's actually a problem versus normal noise, then write a client-facing summary. Repeat per client, every week. Industry estimates put this at 15–20 hours per client per month of manual reporting work, most of it spent finding out nothing was wrong.

The account manager doing this doesn't need more dashboards. They need to know, in the first ten seconds of their morning, which two or three of their ten clients actually need them today.

## What it does

1. **Paste your client roster** — client name, ad spend, revenue this period, revenue last period, plus optional churn % and LTV for subscription brands. Copy it straight out of whatever tracking sheet you already keep.
2. **Every client is scored** against three thresholds: revenue drop ≥30% period over period, churn spike ≥5 percentage points vs. a 3-month average, LTV drop ≥15% vs. a 3-month average.
3. **Clients are triaged red / yellow / green** so the accounts that need attention sort to the top instead of getting lost between the healthy ones.
4. **Flagged clients get a written update** — the key figures plus a recommended next step, in copy-paste-ready format for a client email or deck.
5. **The manual cost is computed automatically** from your own client count, so you see what doing this by hand is actually costing you per month.

Try it with the pre-loaded sample data (10 fictional clients) — it runs the full analysis on page load, no input required to see it work.

## Why not just paste this into ChatGPT?

Two reasons.

- **LLMs are unreliable at consistent arithmetic across many rows.** Ask one to compute percentage change for 15–20 clients and it will occasionally get individual numbers quietly wrong, close enough that nobody double-checks it. This tool does zero LLM math — every calculation is deterministic JavaScript running in the browser, so the same input always produces the same, correct output.
- **A generic chat interface has no opinion about what's actually wrong.** It will happily write a polite paragraph about any number you feed it. The value here isn't the sentence, it's the judgment call about what clears the bar as a real problem versus ordinary noise — see below.

## The thresholds, and why

These are heuristics, not a statistical model — no anomaly-detection math, no standard deviations. They're a judgment call about where normal DTC noise ends, deliberately set high enough to avoid false alarms and low enough to catch a real problem before the client notices it.

| Signal | Threshold | Reasoning |
|---|---|---|
| Revenue | drop ≥30% period over period | Weekly ecommerce revenue naturally swings 10–20% from promos, day-of-week effects, and restocks. 30%+ sits well outside that band and usually means something actually broke — a paused campaign, dead tracking, a site outage. |
| Churn | spike ≥5 percentage points vs. 3-month average | A stable subscription cohort's month-to-month churn typically moves by a point or two. A jump this size usually traces to a price change, a shipping delay, or a failed-payment/dunning issue, not noise. |
| LTV | drop ≥15% vs. 3-month average | LTV is a slow, cohort-based rolling number that doesn't swing daily the way revenue does. A move this size against its own 3-month average is meaningful precisely because the metric is naturally sticky. |

## Privacy

Everything runs client-side — the math never leaves the browser. Only an anonymous aggregate (client count, flag counts, assumed hours/rate) is ever sent to a server, and only when you click Analyze. No client names, revenue figures, or pasted data are logged.

## Tech stack

Static HTML/CSS/vanilla JS. Zero build step, zero frontend dependencies, no LLM calls. Deployed on Vercel. An optional serverless endpoint (`api/log.js`) logs aggregate usage to Supabase and posts a summary to Slack — not required for the tool to work.

## Running locally

```bash
git clone https://github.com/unaiza-autonixlab/reporting-leak-calculator
cd reporting-leak-calculator
npx serve .
```

No build step, no install, no environment variables needed to run the tool itself. `SETUP.md` covers wiring up the optional Supabase/Slack logging.

## Status

Built as a lead-magnet demo, not a production SaaS product — a working preview of the anomaly-detection and narrative-generation logic that runs the same way, live, for a real client's automated reporting pipeline. The thresholds above were tuned once, for one account, and haven't been re-derived per vertical — a low-frequency purchase category and a subscription-heavy one won't have the same noise band, which is a known limitation, not an oversight.

## Built by

[Unaiza Masood](https://calendly.com/unaiza-autonixlab/discovery-call), founder of Autonix Lab. Self-taught, builds automated data pipelines and reporting dashboards for DTC brands and the agencies that serve them, using Claude Code.
