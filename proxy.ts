import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

function getHostname(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-host");
  const host = forwarded ?? req.headers.get("host") ?? "";
  return host.split(",")[0].trim().split(":")[0].toLowerCase();
}

export default function proxy(req: NextRequest) {
  const hostname = getHostname(req);

  // allow localhost (non-subdomain)
  if (hostname === "localhost") return NextResponse.next();

  const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "http://lvh.me:3000";
  const siteBaseHost = new URL(rawBase).hostname.toLowerCase();

  // only handle our domains
  if (!hostname.endsWith(siteBaseHost)) return NextResponse.next();

  // ignore apex + www
  if (hostname === siteBaseHost || hostname === `www.${siteBaseHost}`) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -(siteBaseHost.length + 1));
  if (!subdomain) return NextResponse.next();

  // reserved subdomains
  if (["app", "api", "www"].includes(subdomain)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/site/${subdomain}${
    url.pathname === "/" ? "" : url.pathname
  }`;

  return NextResponse.rewrite(url);
}
