import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeDiscordCode, fetchDiscordGuilds, fetchDiscordUser, getDiscordAvatarUrl } from "@/lib/discord";
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
    const discordGuilds = await fetchDiscordGuilds(tokenData.access_token);
    const guildId = process.env.DISCORD_GUILD_ID;
    const isInGuild = guildId ? discordGuilds.some((guild) => guild.id === guildId) : true;
    const whitelist = await fetchWhitelistStatus(discordUser.id);

    await setSession({
      discordId: discordUser.id,
      username: discordUser.username,
      avatar: getDiscordAvatarUrl(discordUser),
      isWhitelisted: whitelist.isWhitelisted,
      isOwner: whitelist.isOwner,
      hasElite: whitelist.hasElite,
      isStaff: whitelist.isStaff,
      isStakeholder: whitelist.isStakeholder,
      hasPlayerbanks: whitelist.hasPlayerbanks,
      hasBaddie: whitelist.hasBaddie,
      hasDrifter: whitelist.hasDrifter,
      hasTs2026Pack: whitelist.hasTs2026Pack,
      roles: whitelist.roles,
      roleLabels: whitelist.roleLabels,
      guildMemberFound: whitelist.guildMemberFound ?? isInGuild
    });

    return NextResponse.redirect(
      new URL(whitelist.isWhitelisted ? "/?auth=approved" : isInGuild ? "/?auth=denied" : "/?auth=notinguild", request.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/?auth=failed", request.url));
  }
}
