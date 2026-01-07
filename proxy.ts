import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicEnv } from "@/lib/config/env.public";

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

  if (hostname === "localhost") return NextResponse.next();

  const baseHost = publicEnv.NEXT_PUBLIC_ROOT_DOMAIN.toLowerCase();

  if (!hostname.endsWith(baseHost)) return NextResponse.next();

  if (hostname === baseHost || hostname === `www.${baseHost}`) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -(baseHost.length + 1));
  if (!subdomain) return NextResponse.next();

  if (["app", "api", "www", "admin"].includes(subdomain)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/site/${subdomain}${
    url.pathname === "/" ? "" : url.pathname
  }`;

  return NextResponse.rewrite(url);
}
