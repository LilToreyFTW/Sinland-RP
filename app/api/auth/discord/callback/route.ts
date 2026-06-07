import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeDiscordCode, fetchDiscordGuildMember, fetchDiscordGuilds, fetchDiscordUser, getDiscordAvatarUrl } from "@/lib/discord";
import { encodeSession, getSessionCookieName, getSessionCookieOptions, type SessionUser } from "@/lib/session";
import { fetchWhitelistStatus } from "@/lib/whitelist";
import { buildSnapshotFromRoles } from "@/lib/sinland-roles";

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
    const oauthMember =
      guildId && isInGuild
        ? await fetchDiscordGuildMember(tokenData.access_token, guildId).catch(() => null)
        : null;
    const oauthSnapshot =
      guildId && oauthMember
        ? buildSnapshotFromRoles({
            discordId: discordUser.id,
            guildId,
            roles: oauthMember.roles || [],
            guildMemberFound: true
          })
        : null;
    const whitelist = oauthSnapshot || (await fetchWhitelistStatus(discordUser.id));
    const websiteFields = whitelist as Partial<SessionUser>;
    const session: SessionUser = {
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
      guildMemberFound: whitelist.guildMemberFound ?? isInGuild,
      steam: websiteFields.steam,
      steamIdentifier: websiteFields.steamIdentifier,
      steamProfileUrl: websiteFields.steamProfileUrl,
      steamVerifiedAt: websiteFields.steamVerifiedAt,
      verificationRequired: websiteFields.verificationRequired,
      banned: websiteFields.banned,
      ban: websiteFields.ban
    };

    const response = NextResponse.redirect(
      new URL(whitelist.isWhitelisted ? "/?auth=approved" : isInGuild ? "/?auth=denied" : "/?auth=notinguild", request.url)
    );
    response.cookies.set(getSessionCookieName(), encodeSession(session), getSessionCookieOptions());
    response.cookies.set("sinland_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/?auth=failed", request.url));
  }
}
