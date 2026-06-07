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
  steam?: string | null;
  steamIdentifier?: string | null;
  steamProfileUrl?: string | null;
  steamVerifiedAt?: string | null;
  verificationRequired?: boolean;
  banned?: boolean;
  ban?: {
    label?: string;
    reason?: string;
    source?: string;
    matchedBy?: string;
  } | null;
  error?: string;
};

function getBotApiCandidates() {
  const botApiUrl = process.env.BOT_API_URL;
  const botApiKey = process.env.BOT_API_KEY;

  if (!botApiUrl || !botApiKey) {
    throw new Error("BOT_API_URL or BOT_API_KEY is missing.");
  }

  const urls = [botApiUrl];

  try {
    const parsed = new URL(botApiUrl);
    const isIpv4Host = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(parsed.hostname);

    if (parsed.protocol === "https:" && isIpv4Host) {
      const httpUrl = new URL(botApiUrl);
      httpUrl.protocol = "http:";
      urls.push(httpUrl.toString().replace(/\/$/, ""));
    }
  } catch {}

  return {
    botApiKey,
    urls: Array.from(new Set(urls.map((url) => url.replace(/\/$/, ""))))
  };
}

async function fetchWithBotFallback(
  path: string,
  init: RequestInit & { headers?: Record<string, string> }
) {
  const { botApiKey, urls } = getBotApiCandidates();
  let lastError: unknown = null;
  let lastResponse: Response | null = null;

  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          ...(init.headers || {}),
          "x-sinland-api-key": botApiKey
        },
        cache: "no-store"
      });

      lastResponse = response;
      if (response.ok || response.status !== 503) {
        return response;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError instanceof Error ? lastError : new Error("Could not reach the Discord verification service.");
}

export async function fetchWhitelistStatus(discordId: string) {
  const response = await fetchWithBotFallback(`/api/website/member/${discordId}`, {
    headers: {}
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

export async function submitSteamVerification(discordId: string, steamInput: string) {
  const response = await fetchWithBotFallback(`/api/website/verification/${discordId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ steamInput })
  });

  return response;
}
