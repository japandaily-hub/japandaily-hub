import type { APIRoute } from 'astro';

// This route must be server-rendered (not static)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = { "Content-Type": "application/json" };

  let email: string;
  try {
    const body = await request.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email address" }), { status: 400, headers });
  }

  const apiKey = import.meta.env.MAILCHIMP_API_KEY;
  const listId = import.meta.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error("[subscribe] Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID env vars");
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), { status: 500, headers });
  }

  // API key format: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-usN
  const dc = apiKey.split("-").pop();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const auth = btoa(`anystring:${apiKey}`);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    });
  } catch (err) {
    console.error("[subscribe] Mailchimp fetch failed:", err);
    return new Response(JSON.stringify({ error: "Network error" }), { status: 502, headers });
  }

  const data = await res.json() as Record<string, unknown>;

  if (res.ok) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  // Already subscribed → treat as success
  if (data.title === "Member Exists") {
    return new Response(JSON.stringify({ success: true, alreadySubscribed: true }), { status: 200, headers });
  }

  console.error("[subscribe] Mailchimp error:", data);
  return new Response(
    JSON.stringify({ error: (data.detail as string) ?? "Subscription failed" }),
    { status: 500, headers }
  );
};
