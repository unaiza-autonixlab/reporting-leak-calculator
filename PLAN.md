# The Reporting Leak Audit: build plan

## What it is
Free, no-login, single-page tool for DTC performance agencies (5–30 clients). Two steps on one page:

**Step 1: Leak Calculator (hook, 30 sec)**
Inputs: # of clients, avg hours/client/month on reporting (prefill 15–20, sourced benchmark), blended hourly rate (prefill $75).
Output: $/month bleeding on manual reporting, annualized, plus a comparison table against what they'd pay for AgencyAnalytics ($20/client/mo), Whatagraph ($215–760/mo), DashThis ($44–429/mo), vs. the $3.5K setup + $750/mo DFY offer. Pure math, but the competitor pricing table is real 2026 research most agencies haven't assembled themselves.

**Step 2: Exception & Narrative Engine (the actual tool)**
Form for up to 3 clients/channels: this-period vs last-period revenue, spend, optional churn rate, optional LTV.
On submit (client-side JS, deterministic, no LLM call):
- Flags anomalies using the exact severity thresholds already validated in production on Innerbody (`innerbody-dashboard-frontend/src/hooks/useAnomalyDetection.js`): revenue drop >30% WoW = high, churn spike >5pp vs 3-mo avg = high, LTV drop >15% vs 3-mo avg = medium. Add ROAS drop >20% and CAC increase >25% as new thresholds in the same style.
- Writes a white-label-ready narrative block in the "3 to 4 key figures plus next steps" format (the exact format the case study cites as "the format clients actually read").
- Copy-to-clipboard button. Output is pasteable into a client deck/email immediately.

## Why this beats opening ChatGPT
1. Zero prompt engineering. Structured in, structured out, same format every time.
2. Encodes judgment, not just summarization. Hardcoded severity thresholds tuned on a live 7-figure DTC brand decide what's actually a problem vs. noise. A blank chat window will cheerfully narrate any number you feed it; this tool is opinionated by design.
3. Faster than writing a good prompt. No account, no data connection, no context-setting.
4. It's a live, working sample of the two hero features of the paid product (AI narrative commentary + exception alerts). The CTA writes itself: "this is the free preview; the paid version runs this across all your clients automatically."

## Market check (why not "just another AI report summarizer")
AgencyAnalytics, Swydo, and Whatagraph already ship AI narrative summaries, but gated behind a paid account and full data integration. Nothing free does instant, zero-setup, typed-in-numbers exception flagging plus narrative on one page. That gap is the offer.

## Architecture: reuse the exact stack already live at dtc-attribution-calculator.vercel.app
- Single `index.html`, black/orange brand, same layout language (inputs, divider, results, CTA).
- `api/log.js`: copy the existing pattern (Supabase insert + Slack notify), new table `leak_audit_submissions`, new fields (clients, hours, rate, flags triggered, narrative generated).
- `vercel.json`: identical rewrite rules.
- `?agency=` URL param for personalization, same pattern already proven, reuse for LinkedIn/outreach links with UTM.
- CTA to the same Calendly link, `utm_source=leak-audit`.

## Build time (~1 hour, because the scaffold is a copy, not new)
- 15 min: HTML/CSS shell (fork existing calculator's styles, add step 2 form)
- 20 min: JS: leak math, competitor comparison table, anomaly thresholds ported from useAnomalyDetection.js, narrative template strings
- 10 min: Supabase table + adapt api/log.js
- 10 min: Deploy to Vercel, wire existing Slack webhook env vars, test both steps end-to-end
- 5 min: buffer

## Content angle (LinkedIn)
Post the tool with a real number pulled from running it on Innerbody's own data as the unfakeable detail (satisfies the no-generic-post rule). Angle: "Built a free tool that tells you exactly what your manual reporting is costing you, then writes your next client update for you in 10 seconds." Short, no em dash, ends on a question, per existing voice rules.

## Status
Built and deployed live at https://reporting-leak-calculator.vercel.app (2026-08-25). UI redesigned to be visual/animated rather than text-heavy: animated ring chart for the triage summary, animated bar chart for the cost comparison, card grid with diverging delta bars instead of a plain table. See build-log.md style history in this repo's commits for the full sequence.
