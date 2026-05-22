import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { getSession } from "@/lib/session";
import { tiers } from "@/lib/tiers";

export default async function HomePage() {
  const session = await getSession();
  const isAllowed = Boolean(session?.isWhitelisted);
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/2uRphk42HU";

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <div className="brand-title">SinLand-RP</div>
          <div className="brand-sub">Custom QBCore Roleplay</div>
        </div>
        <div className="topbar-actions">
          {session ? (
            <>
              <span className="button secondary">{session.username}</span>
              <Link href="/api/auth/logout" className="button secondary">
                Logout
              </Link>
            </>
          ) : (
            <Link href="/api/auth/discord/login" className="button">
              Login with Discord
            </Link>
          )}
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">Grit. Chaos. Loyalty. Survival.</span>
        <div className="hero-grid">
          <div>
            <h1>Make Your Name In SinLand</h1>
            <p>
              Welcome to SinLand-RP, a city built around chaos, ambition, loyalty, temptation,
              and survival. This is a gritty, story-driven world where every player has the chance
              to build a reputation, chase money, run businesses, rise through crime, create drama,
              or become a name the whole city remembers.
            </p>
            <div className="hero-actions">
              <Link href={discordInvite} className="button">
                Join The Discord
              </Link>
              <a href="#tiers" className="button secondary">
                View Tier Packages
              </a>
            </div>
          </div>
          <aside className="hero-side">
            <h2>What SinLand-RP Offers</h2>
            <ul className="hero-list">
              <li>Custom QBCore experience</li>
              <li>Immersive roleplay atmosphere</li>
              <li>Unique vehicles and custom content</li>
              <li>Crime, business, reputation, and lifestyle RP</li>
              <li>Adult, dramatic, and unpredictable storytelling</li>
              <li>A city where player choices shape the world</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="content-grid">
        <article className="section-card">
          <h2>Built To Be A Real Home</h2>
          <p>
            This is not just another FiveM city with jobs and cars. The streets are dangerous, the
            nightlife is loud, and every choice matters. Whether you come for a fresh start, power,
            respect, fast cars, or something darker, the city gives you room to create your own story.
          </p>
        </article>
        <article className="section-card">
          <h2>Community First</h2>
          <p>
            SinLand-RP is being built into a real community where players stay, bring friends, help
            shape the server from the ground up, and turn the city into their main home.
            Developer: <strong>sinland_dev</strong>.
          </p>
        </article>
      </section>

      <section className="gate-wrapper">
        <div className="gate-card">
          <h2>Discord Whitelist Gate</h2>
          <p>
            Only users with the Discord whitelist role can access the full website and purchase pages.
            Login with Discord and the site will verify your role through the SinLand bot before unlocking the store.
          </p>
          {session ? (
            <p>
              Status: <strong>{isAllowed ? "Whitelisted" : "Not Whitelisted"}</strong>
            </p>
          ) : (
            <p>Status: <strong>Not logged in</strong></p>
          )}
          {!isAllowed && (
            <div className="hero-actions">
              <Link href="/api/auth/discord/login" className="button">
                Verify With Discord
              </Link>
              <Link href={discordInvite} className="button secondary">
                Need The Whitelist Role?
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="tiers">
        <div className="tiers-header">
          <h2>SinLand Tier Packages</h2>
          <p className="tier-desc">
            Ten storefront tiers are ready. Checkout is locked behind Discord whitelist verification.
          </p>
        </div>
        <div className="tiers-grid">
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
              {isAllowed ? (
                <CheckoutButton tierSlug={tier.slug} />
              ) : (
                <Link href="/api/auth/discord/login" className="button secondary">
                  Login To Unlock
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <p className="footer-note">
        In SinLand, people become legends, enemies, lovers, outlaws, business owners, gang leaders,
        and ghosts. Are you ready to make your name?
      </p>
    </main>
  );
}
