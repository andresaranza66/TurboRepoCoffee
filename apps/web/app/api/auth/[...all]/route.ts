import { handler } from "@/lib/auth-server";

export async function GET(request: Request) {
  try {
    const res = await handler.GET(request);
    if (!res.ok) {
      try {
        const cloned = res.clone();
        const text = await cloned.text();
        const headers = Object.fromEntries(res.headers.entries());
        console.error("[auth route] GET non-OK response", {
          url: request.url,
          status: res.status,
          statusText: res.statusText,
          headers,
          body: text,
        });
      } catch (e) {
        console.error("[auth route] GET non-OK response (failed to read body)", {
          url: request.url,
          status: res.status,
          statusText: res.statusText,
          error: e,
        });
      }
    }
    return res;
  } catch (err) {
    console.error("[auth route] GET error", err);
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const res = await handler.POST(request);
    if (!res.ok) {
      try {
        const cloned = res.clone();
        const text = await cloned.text();
        const headers = Object.fromEntries(res.headers.entries());
        console.error("[auth route] POST non-OK response", {
          url: request.url,
          status: res.status,
          statusText: res.statusText,
          headers,
          body: text,
        });
      } catch (e) {
        console.error("[auth route] POST non-OK response (failed to read body)", {
          url: request.url,
          status: res.status,
          statusText: res.statusText,
          error: e,
        });
      }
    }
    return res;
  } catch (err) {
    console.error("[auth route] POST error", err);
    throw err;
  }
}
