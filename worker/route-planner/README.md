# Route planner: AI helper

The route planner works without this: it matches a reader's goal against each piece's subjects, themes and key terms. This small Cloudflare Worker adds AI planning on top. It holds the Claude API key so the key never appears on the public website.

## One-time setup (about 15 minutes)

1. **Get a Claude API key.** Sign up at https://console.anthropic.com, add a little credit under Billing, then create a key under API Keys. Copy it somewhere safe; it starts with `sk-ant-`.
2. **Make a free Cloudflare account** at https://dash.cloudflare.com/sign-up.
3. **Deploy the Worker** from this folder on your computer (needs Node.js):

   ```bash
   cd worker/route-planner
   npm install
   npx wrangler login                     # opens the browser to connect your Cloudflare account
   npx wrangler secret put ANTHROPIC_API_KEY   # paste the key when asked
   npx wrangler deploy
   ```

   The last command prints the Worker's address, something like `https://infolio-route-planner.<your-name>.workers.dev`.
4. **Switch it on in the app:** paste that address into `ROUTE_PLANNER_URL` in `src/config.ts` and push.

## Good to know

- **Cost:** each plan is one short Claude request, roughly 1 to 3 US cents with the station list as it is today. Set a monthly spend limit in the Claude Console under Limits.
- **Model:** `claude-opus-5-5`, set in `src/index.ts`. Switching to `claude-haiku-5-5` there makes each plan far cheaper, at some cost to quality.
- **Who can use it:** only the sites listed in `ALLOWED_ORIGINS` in `wrangler.toml`. Add `https://infolio.in` there once the domain is live, then deploy again.
- **If it fails:** the app quietly falls back to the built-in matcher, so readers always get a route.
