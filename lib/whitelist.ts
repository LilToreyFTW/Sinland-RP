export type WhitelistSnapshot = {
  success: boolean;
  isWhitelisted: boolean;
  isOwner?: boolean;
  roles?: string[];
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
    return { success: false, isWhitelisted: false } satisfies WhitelistSnapshot;
  }

  return response.json() as Promise<WhitelistSnapshot>;
}
