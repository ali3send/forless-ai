import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

export default function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // remove port

  // Allow localhost normally
  if (hostname === "localhost") {
    return NextResponse.next();
  }

  const siteBaseHost = (process.env.NEXT_PUBLIC_SITE_BASE_URL || "lvh.me")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!hostname.endsWith(siteBaseHost)) {
    return NextResponse.next();
  }

  const parts = hostname.split(".");

  // mysite.lvh.me → ["mysite","lvh","me"]
  if (parts.length < 3) return NextResponse.next();

  const subdomain = parts[0].toLowerCase();

  // reserved subdomains
  if (subdomain === "app") return NextResponse.next();

  const url = req.nextUrl;
  url.pathname = `/site/${subdomain}${
    url.pathname === "/" ? "" : url.pathname
  }`;

  return NextResponse.rewrite(url);
}
