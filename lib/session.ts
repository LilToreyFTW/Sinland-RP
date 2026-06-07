import crypto from "node:crypto";
import { cookies } from "next/headers";

export type SessionUser = {
  discordId: string;
  username: string;
  avatar: string | null;
  isWhitelisted: boolean;
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
};

const COOKIE_NAME = "sinland_session";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is missing.");
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function encodeSession(session: SessionUser) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  const [payload, signature] = rawValue.split(".");
  if (!payload || !signature) {
    return null;
  }

  if (sign(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return decodeSession(store.get(COOKIE_NAME)?.value);
}

export async function setSession(session: SessionUser) {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}
