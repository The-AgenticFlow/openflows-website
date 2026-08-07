# OpenFlows OAuth Proxy (Cloudflare Worker)

OAuth proxy that enables Decap CMS to authenticate against GitHub from the
static site hosted on GitHub Pages.

## Why this is needed

GitHub OAuth client secrets cannot be exposed in a static site. Decap CMS
(`/admin`) needs a small proxy to exchange the OAuth `code` for an access
token on the server side. This Cloudflare Worker does that.

## Deploy steps

### 1. Create a GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**

- Application name: `openflows-website`
- Homepage URL: `https://openflows.dev`
- Authorization callback URL: `https://openflows-oauth-proxy.<subdomain>.workers.dev/callback`

Save and note the **Client ID** and **Client Secret**.

### 2. Install Wrangler and log in

```bash
cd cloudflare-oauth-proxy
npm install
npx wrangler login
```

### 3. Set your GitHub App credentials in Worker env

Edit `wrangler.toml` and replace `GITHUB_CLIENT_ID`, then set the secret:

```bash
npx wrangler secret put GITHUB_CLIENT_SECRET
```

### 4. Deploy

```bash
npx wrangler deploy
```

Note the `*.workers.dev` URL it prints.

### 5. Wire it into Decap CMS config

In `public/admin/config.yml`, set:

```yaml
backend:
  base_url: https://openflows-oauth-proxy.<subdomain>.workers.dev
```

And make sure the GitHub OAuth App callback URL matches
`https://openflows-oauth-proxy.<subdomain>.workers.dev/callback`.

Commit + push. GitHub Actions rebuilds and redeploys the site.
