import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeDiscordCode, fetchDiscordUser, getDiscordAvatarUrl } from "@/lib/discord";
import { setSession } from "@/lib/session";
import { fetchWhitelistStatus } from "@/lib/whitelist";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get("sinland_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?auth=failed", request.url));
  }

  try {
    const tokenData = await exchangeDiscordCode(code);
    const discordUser = await fetchDiscordUser(tokenData.access_token);
    const whitelist = await fetchWhitelistStatus(discordUser.id);

    await setSession({
      discordId: discordUser.id,
      username: discordUser.username,
      avatar: getDiscordAvatarUrl(discordUser),
      isWhitelisted: whitelist.isWhitelisted
    });

    return NextResponse.redirect(
      new URL(whitelist.isWhitelisted ? "/?auth=approved" : "/?auth=denied", request.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/?auth=failed", request.url));
  }
}
