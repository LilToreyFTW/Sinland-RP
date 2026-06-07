export const sinlandRoleIds = {
  whitelist: process.env.DISCORD_ROLE_WHITELIST_ID || "1467462208563843199",
  elite: process.env.DISCORD_ROLE_ELITE_ID || "1507860476585840871",
  staff: process.env.DISCORD_ROLE_STAFF_ID || "1507164603354976337",
  stakeholder: process.env.DISCORD_ROLE_STAKEHOLDER_ID || "1507600842562469898",
  owner: process.env.DISCORD_ROLE_OWNER_ID || "1467441875664506993",
  playerbanks: process.env.DISCORD_ROLE_PLAYERBANKS_ID || "1507164885983957032",
  baddie: process.env.DISCORD_ROLE_BADDIE_ID || "1507201830118232125",
  drifter: process.env.DISCORD_ROLE_DRIFTER_ID || "1507646374965940244",
  ts2026pack: process.env.DISCORD_ROLE_TS2026PACK_ID || "1508469904423125142"
} as const;

export type DiscordRoleSnapshot = {
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

export function buildSnapshotFromRoles(input: {
  discordId: string;
  guildId?: string;
  roles: string[];
  guildMemberFound: boolean;
}): DiscordRoleSnapshot {
  const roleSet = new Set(input.roles.map(String));
  const isOwner = roleSet.has(sinlandRoleIds.owner);
  const isWhitelisted = isOwner || roleSet.has(sinlandRoleIds.whitelist);
  const hasElite = roleSet.has(sinlandRoleIds.elite);
  const isStaff = roleSet.has(sinlandRoleIds.staff);
  const isStakeholder = roleSet.has(sinlandRoleIds.stakeholder);
  const hasPlayerbanks = roleSet.has(sinlandRoleIds.playerbanks);
  const hasBaddie = roleSet.has(sinlandRoleIds.baddie);
  const hasDrifter = roleSet.has(sinlandRoleIds.drifter);
  const hasTs2026Pack = roleSet.has(sinlandRoleIds.ts2026pack);

  const roleLabels = [
    isOwner ? "Owner" : null,
    isWhitelisted ? "Whitelisted" : null,
    hasElite ? "Elite" : null,
    isStaff ? "Staff" : null,
    isStakeholder ? "Stakeholder" : null,
    hasPlayerbanks ? "Playerbanks" : null,
    hasBaddie ? "Baddie" : null,
    hasDrifter ? "Drifter" : null,
    hasTs2026Pack ? "T's 2026 Pack" : null
  ].filter(Boolean) as string[];

  return {
    success: true,
    discordId: input.discordId,
    guildId: input.guildId,
    isOwner,
    isWhitelisted,
    hasElite,
    isStaff,
    isStakeholder,
    hasPlayerbanks,
    hasBaddie,
    hasDrifter,
    hasTs2026Pack,
    roles: input.roles,
    roleLabels,
    guildMemberFound: input.guildMemberFound
  };
}
