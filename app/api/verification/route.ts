import { NextResponse } from "next/server";
import { getSession, setSession } from "@/lib/session";
import { submitSteamVerification } from "@/lib/whitelist";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.discordId) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = (await request.json()) as { steamInput?: string; discordId?: string };
  const steamInput = String(body.steamInput || "").trim();

  if (!steamInput) {
    return NextResponse.json({ error: "Missing Steam profile or FiveM hex." }, { status: 400 });
  }

  const response = await submitSteamVerification(session.discordId, steamInput);
  const payload = (await response.json()) as {
    success?: boolean;
    error?: string;
    access?: {
      isWhitelisted?: boolean;
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
    };
  };

  if (!response.ok) {
    return NextResponse.json({ error: payload.error || "Verification failed." }, { status: response.status });
  }

  await setSession({
    ...session,
    ...payload.access
  });

  return NextResponse.json({ success: true });
}
