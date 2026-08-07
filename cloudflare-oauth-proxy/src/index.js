/**
 * Cloudflare Worker OAuth proxy for Decap CMS (Netlify-hosted proxy pattern).
 *
 * This worker exchanges the OAuth `code` returned by GitHub for an access
 * token, using the GitHub App client ID + secret. The secret is stored as a
 * Cloudflare Worker secret (never in the repo or config).
 */

// GitHub endpoints
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const CALLBACK_URL_PATTERN = /\/callback\/?/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Health/root route
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "")) {
      return new Response("OpenFlows OAuth proxy is running.", {
        status: 200,
      });
    }

    // Auth route: redirect user to GitHub to authorize
    if (url.pathname === "/auth" || url.pathname === "/auth/") {
      const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("scope", "repo,user");
      authorizeUrl.searchParams.set("state", url.searchParams.get("state") || "");
      authorizeUrl.searchParams.set(
        "redirect_uri",
        `${url.origin}/callback`
      );
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // Callback route: exchange code for token
    if (CALLBACK_URL_PATTERN.test(url.pathname)) {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      try {
        const token = await exchangeCode(code, url.origin, env);
        return new Response(token, {
          status: 200,
          headers: corsHeaders(),
        });
      } catch (err) {
        return new Response(`OAuth token exchange failed: ${err.message}`, {
          status: 500,
          headers: corsHeaders(),
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};

async function exchangeCode(code, origin, env) {
  const body = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: `${origin}/callback`,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`GitHub returned ${res.status}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error_description || json.error);
  }

  return json.access_token;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}
