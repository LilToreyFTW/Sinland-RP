import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SiteChrome } from "@/components/SiteChrome";
import { VerificationGate } from "@/components/VerificationGate";
import { getSession } from "@/lib/session";
import { getServerSnapshot } from "@/lib/server-data";
import { tiers } from "@/lib/tiers";

export default async function HomePage() {
  const session = await getSession();
  const liveRoles = session?.discordId ? await getLiveSnapshot(session.discordId) : null;
  const activeSession = session
    ? {
        ...session,
        ...(liveRoles?.success ? liveRoles : {}),
        guildMemberFound: liveRoles?.success ? liveRoles.guildMemberFound ?? session.guildMemberFound : session.guildMemberFound
      }
    : null;
  const needsVerification = Boolean(
    activeSession?.discordId
      && activeSession?.guildMemberFound
      && (typeof activeSession?.verificationRequired === "boolean"
        ? activeSession.verificationRequired
        : !activeSession?.steamVerifiedAt)
  );
  const isBanned = Boolean(activeSession?.banned);
  const isAllowed = Boolean(activeSession?.isWhitelisted);
  const isFullyUnlocked = Boolean(isAllowed && !needsVerification && !isBanned);
  const snapshot = getServerSnapshot();
  const highlightCategories = snapshot.categories.slice(0, 6);
  const roleSummary = [
    activeSession?.isOwner ? "Owner" : null,
    activeSession?.isStaff ? "Staff" : null,
    activeSession?.isStakeholder ? "Stakeholder" : null,
    activeSession?.hasElite ? "Elite" : null,
    activeSession?.hasPlayerbanks ? "Playerbanks" : null,
    activeSession?.hasBaddie ? "Baddie" : null,
    activeSession?.hasDrifter ? "Drifter" : null,
    activeSession?.hasTs2026Pack ? "T's 2026 Pack" : null
  ].filter(Boolean) as string[];

  return (
    <SiteChrome session={activeSession}>
      {activeSession?.discordId && activeSession.guildMemberFound && (needsVerification || isBanned) ? (
        <section className="section-band">
          {isBanned ? (
            <section className="verification-panel banned-panel">
              <div className="section-heading">
                <span className="section-kicker">Access Blocked</span>
                <h2>This account is banned from Sinland-RP.</h2>
                <p>
                  Your Discord account or linked Steam/FiveM hex matched the protected ban records already loaded from
                  Sinland enforcement.
                </p>
              </div>
              <div className="resource-card">
                <h3>{activeSession.ban?.label || "Protected Ban"}</h3>
                <p>{activeSession.ban?.reason || "Protected Sinland ban."}</p>
              </div>
            </section>
          ) : (
            <VerificationGate discordId={activeSession.discordId} steamIdentifier={activeSession.steamIdentifier} />
          )}
        </section>
      ) : null}

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="section-kicker">Live Server Overview</span>
          <h2>Sinland-RP now reflects the real server stack.</h2>
          <p>
            This site is now anchored to the actual QBCore deployment, Sinland custom packs, mapped interiors,
            vehicle libraries, Discord systems, and protected server tools running behind the city.
          </p>
          <div className="hero-actions">
            <Link href="/garage" className="button">
              Browse Vehicles
            </Link>
            <Link href="/forums" className="button secondary">
              Open Forums
            </Link>
          </div>
        </div>

        <div className="hero-grid-stats">
          <div className="mini-card">
            <span className="metric-label">Tracked Resources</span>
            <strong>{snapshot.totalResources}</strong>
          </div>
          <div className="mini-card">
            <span className="metric-label">Vehicle Entries</span>
            <strong>{snapshot.vehicles.length}</strong>
          </div>
          <div className="mini-card">
            <span className="metric-label">Protected Systems</span>
            <strong>{snapshot.featuredSystems.length}</strong>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Server Modules</span>
          <h2>Everything important is surfaced here.</h2>
          <p>From base framework content to Sinland custom packs, the website now mirrors the actual server layout.</p>
        </div>
        <div className="resource-grid">
          {highlightCategories.map((category) => (
            <article className="resource-card" key={category.slug}>
              <div className="resource-top">
                <h3>{category.title}</h3>
                <span className="pill">{category.resourceCount} folders</span>
              </div>
              <p>{category.description}</p>
              <div className="chip-row">
                {category.resources.slice(0, 4).map((resource) => (
                  <span className="tiny-chip" key={resource.name}>
                    {resource.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Security Stack</span>
          <h2>Copyright guard and encryption are now represented on-site.</h2>
          <p>
            The site now calls out the Sinland copyright lock and the encryption integrity layer so the protected
            server stack is visible as part of the brand, not hidden implementation detail.
          </p>
        </div>
        <div className="resource-grid two-up">
          <article className="resource-card accent-card">
            <h3>sinland-copyright</h3>
            <p>Machine-lock enforcement, startup guard rails, self-integrity checks, and protected resource shutdown.</p>
          </article>
          <article className="resource-card accent-card">
            <h3>sinland-encrytion</h3>
            <p>Integrity manifests, signed baselines, encrypted backups, audit hooks, and resource tamper monitoring.</p>
          </article>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Storefront</span>
          <h2>Tier packages stay live behind the whitelist gate.</h2>
          <p>Store access still respects the Discord role check already built into the site.</p>
        </div>
        <div className="gate-card">
          <div>
            <h3>Discord access status</h3>
            <p>
              {!activeSession
                ? "Not logged in yet."
                : isBanned
                  ? "Access blocked by protected ban enforcement."
                  : needsVerification
                    ? "Logged in, but Steam/FiveM hex verification is required before full access."
                    : isFullyUnlocked
                      ? "Whitelisted and unlocked."
                    : needsVerification
                      ? "Discord verified, but you still must submit your FiveM hex before full access."
                  : activeSession.guildMemberFound === false
                    ? "Logged in, but this Discord account is not inside the Sinland guild yet."
                    : "Logged in, but not whitelisted yet."}
            </p>
            {activeSession ? (
              <div className="status-stack">
                <div className="status-row">
                  <span>Guild membership</span>
                  <strong>{activeSession.guildMemberFound === false ? "Not found" : "Found"}</strong>
                </div>
                <div className="status-row">
                  <span>Whitelist role</span>
                  <strong>{isAllowed ? "Granted" : "Missing"}</strong>
                </div>
                <div className="status-row">
                  <span>FiveM hex verification</span>
                  <strong>{activeSession.steamVerifiedAt ? "Confirmed" : "Required"}</strong>
                </div>
                <div className="status-row">
                  <span>Website access</span>
                  <strong>{isFullyUnlocked ? "Unlocked" : needsVerification ? "Pending verification" : isBanned ? "Blocked" : "Limited"}</strong>
                </div>
                <div className="status-row">
                  <span>Ban status</span>
                  <strong>{isBanned ? "Blocked" : "Clear"}</strong>
                </div>
                {roleSummary.length ? (
                  <div className="chip-row">
                    {roleSummary.map((item) => (
                      <span className="tiny-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          {needsVerification ? (
            <a href="#verification-gate" className="button">
              Complete FiveM Hex Verification
            </a>
          ) : !isFullyUnlocked ? (
            <Link href="/api/auth/discord/login" className="button secondary">
              Verify with Discord
            </Link>
          ) : null}
        </div>
        {!needsVerification && !isBanned ? <div className="tiers-grid">
          {tiers.map((tier) => (
            <article key={tier.slug} className="tier-card">
              <span className="tier-badge" style={{ backgroundColor: `${tier.accent}22`, color: tier.accent }}>
                {tier.badge}
              </span>
              <div className="tier-top">
                <div>
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-desc">{tier.description}</p>
                </div>
                <div className="tier-price">{tier.priceLabel}</div>
              </div>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {tier.restrictions ? <div className="restriction">{tier.restrictions}</div> : null}
              {isFullyUnlocked ? <CheckoutButton tierSlug={tier.slug} /> : needsVerification ? <a href="#verification-gate" className="button secondary">Finish FiveM Hex Verification</a> : <Link href="/api/auth/discord/login" className="button secondary">Login To Unlock</Link>}
            </article>
          ))}
        </div> : null}
      </section>
    </SiteChrome>
  );
}

async function getLiveSnapshot(discordId: string) {
  try {
    return await import("@/lib/whitelist").then(({ fetchWhitelistStatus }) => fetchWhitelistStatus(discordId));
  } catch {
    return null;
  }
}
