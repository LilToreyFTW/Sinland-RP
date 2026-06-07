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

const COOKIE_NAME = "sinland_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
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
  store.set(COOKIE_NAME, encodeSession(session), getSessionCookieOptions());
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", getSessionCookieOptions(0));
}
