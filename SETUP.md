# Setup checklist before this goes live

## 1. Supabase table
Run this in the Supabase SQL editor for the same project used by dtc-attribution-calculator:

```sql
create table leak_audit_submissions (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  agency text,
  num_clients int,
  num_high int,
  num_medium int,
  num_green int,
  hrs_per_client numeric,
  rate numeric,
  leak_monthly numeric
);
```

## 2. Vercel env vars (new project)
Same three vars already used by dtc-attribution-calculator. Either reuse the same values or point to the same Slack channel:
- `SUPABASE_SERVICE_KEY`
- `SLACK_TOKEN`
- `SLACK_CHANNEL_ID`

## 3. Deploy
```
cd reporting-leak-calculator
vercel --prod
```

## Notes
- No client names or revenue numbers are ever sent to the backend. Only aggregate counts (client count, flag counts, assumed hrs/rate, computed leak $). Safe even if someone pastes real client data instead of the sample.
- `?agency=Name` in the URL personalizes the CTA link exactly like the attribution calculator, for outreach/LinkedIn links.
