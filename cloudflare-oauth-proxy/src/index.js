/**
 * Cloudflare Worker OAuth proxy for Decap CMS.
 *
 * Adapted from the official Decap Cloudflare Worker template
 * (https://github.com/sterlingwes/decap-proxy). The callback returns an HTML
 * page that hands the access token back to the Decap popup via
 * window.opener.postMessage, which is how Decap completes its login flow.
 */

const provider = "github";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/auth") {
      return handleAuth(url, env);
    }

    if (pathname === "/callback") {
      return handleCallback(url, env);
    }

    return new Response("Hello 👋", { status: 200 });
  },
};

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function handleAuth(url, env) {
  if (url.searchParams.get("provider") !== provider) {
    return new Response("Invalid provider", { status: 400 });
  }

  const redirectUri = `${url.origin}/callback?provider=${provider}`;
  const authorizationUri = [
    "https://github.com/login/oauth/authorize",
    "?client_id=" + encodeURIComponent(env.GITHUB_CLIENT_ID),
    "&redirect_uri=" + encodeURIComponent(redirectUri),
    "&scope=" + encodeURIComponent("repo,user"),
    "&state=" + randomHex(4),
  ].join("");

  return new Response(null, {
    status: 301,
    headers: { location: authorizationUri },
  });
}

async function handleCallback(url, env) {
  if (url.searchParams.get("provider") !== provider) {
    return new Response("Invalid provider", { status: 400 });
  }

  const githubError = url.searchParams.get("error");
  if (githubError) {
    return callbackScriptResponse(
      "error",
      `${githubError}: ${url.searchParams.get("error_description") || ""}`
    );
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(
      "Missing code. Full query: " + url.search + " path: " + url.pathname,
      { status: 400 }
    );
  }

  const redirectUri = `${url.origin}/callback?provider=${provider}`;
  try {
    const token = await exchangeCode(code, redirectUri, env);
    return callbackScriptResponse("success", token);
  } catch (err) {
    return callbackScriptResponse("error", err.message);
  }
}

async function exchangeCode(code, redirectUri, env) {
  const body = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://github.com/login/oauth/access_token", {
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

function callbackScriptResponse(status, token) {
  return new Response(
    `<html>
<head>
  <script>
    const receiveMessage = (message) => {
      window.opener.postMessage(
        'authorization:github:${status}:${JSON.stringify({ token })}',
        '*'
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  </script>
  <body>
    <p>Authorizing Decap...</p>
  </body>
</html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
