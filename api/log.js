const SUPABASE_URL = 'https://egxddtwwhtiqfwyqxqbo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SLACK_TOKEN  = process.env.SLACK_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { agency, numClients, numHigh, numMedium, numGreen, hrsPerClient, rate, leakMonthly } = req.body;

  // Aggregate counts only. Never the pasted client names or revenue numbers.
  await fetch(`${SUPABASE_URL}/rest/v1/leak_audit_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      agency: agency || null,
      num_clients: numClients,
      num_high: numHigh,
      num_medium: numMedium,
      num_green: numGreen,
      hrs_per_client: hrsPerClient,
      rate,
      leak_monthly: leakMonthly,
    }),
  });

  const label = agency ? `*${agency}*` : '_(no agency, direct link)_';
  const fmt = n => '$' + Number(n).toLocaleString();

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL,
      unfurl_links: false,
      text: `:rotating_light: Reporting Leak Audit for ${agency || 'unknown'}`,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `:rotating_light: *Reporting Leak Audit run* for ${label}` },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Clients:*\n${numClients}` },
            { type: 'mrkdwn', text: `*Flagged:*\n${numHigh} high / ${numMedium} medium` },
            { type: 'mrkdwn', text: `*Assumed cost:*\n${fmt(hrsPerClient)} hrs/client @ $${rate}/hr` },
            { type: 'mrkdwn', text: `*Monthly leak:*\n${fmt(leakMonthly)}` },
          ],
        },
      ],
    }),
  });

  return res.status(200).json({ ok: true });
}
