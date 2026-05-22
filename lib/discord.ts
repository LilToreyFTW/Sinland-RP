export type DiscordUser = {
  id: string;
  username: string;
  avatar: string | null;
};

export function getDiscordAvatarUrl(user: DiscordUser) {
  if (!user.avatar) {
    return null;
  }

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}

export async function exchangeDiscordCode(code: string) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    client_secret: process.env.DISCORD_CLIENT_SECRET || "",
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
    scope: "identify guilds"
  });

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Discord token exchange failed.");
  }

  return response.json() as Promise<{ access_token: string }>;
}

export async function fetchDiscordUser(accessToken: string) {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Discord user fetch failed.");
  }

  return response.json() as Promise<DiscordUser>;
}
