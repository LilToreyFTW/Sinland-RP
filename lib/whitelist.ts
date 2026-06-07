export type WhitelistSnapshot = {
  success: boolean;
  isWhitelisted: boolean;
  discordId?: string;
  guildId?: string;
  isOwner?: boolean;
  hasElite?: boolean;
  isStaff?: boolean;
  isStakeholder?: boolean;
  hasPlayerbanks?: boolean;
  hasBaddie?: boolean;
  hasDrifter?: boolean;
  hasTs2026Pack?: boolean;
  roles?: string[];
  roleLabels?: string[];
  guildMemberFound?: boolean;
  error?: string;
};

export async function fetchWhitelistStatus(discordId: string) {
  const botApiUrl = process.env.BOT_API_URL;
  const botApiKey = process.env.BOT_API_KEY;

  if (!botApiUrl || !botApiKey) {
    throw new Error("BOT_API_URL or BOT_API_KEY is missing.");
  }

  const response = await fetch(`${botApiUrl}/api/website/member/${discordId}`, {
    headers: {
      "x-sinland-api-key": botApiKey
    },
    cache: "no-store"
  });

  if (!response.ok) {
    let error = "Could not verify Discord roles.";

    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) {
        error = body.error;
      }
    } catch {}

    return {
      success: false,
      isWhitelisted: false,
      guildMemberFound: response.status !== 404,
      error
    } satisfies WhitelistSnapshot;
  }

  return response.json() as Promise<WhitelistSnapshot>;
}
