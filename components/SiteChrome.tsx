import Link from "next/link";
import { SessionUser } from "@/lib/session";

const links = [
  { href: "/", label: "Home" },
  { href: "/garage", label: "Garage" },
  { href: "/server", label: "Server Stack" },
  { href: "/forums", label: "Forums" }
];

export function SiteChrome({
  session,
  children
}: Readonly<{ session: SessionUser | null; children: React.ReactNode }>) {
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/2uRphk42HU";

  return (
    <main className="site-shell">
      <header className="masthead">
        <div className="brand-block">
          <span className="brand-kicker">Sinland-RP</span>
          <h1 className="brand-name">Server Hub</h1>
          <p className="brand-copy">Built from the real Sinland resource stack, not just a generic city pitch.</p>
        </div>
        <div className="masthead-actions">
          <Link href={discordInvite} className="button">
            Join Discord
          </Link>
          {session ? (
            <>
              <span className="button secondary static-chip">{session.username}</span>
              <Link href="/api/auth/logout" className="button secondary">
                Logout
              </Link>
            </>
          ) : (
            <Link href="/api/auth/discord/login" className="button secondary">
              Login with Discord
            </Link>
          )}
        </div>
      </header>

      <nav className="nav-band" aria-label="Primary">
        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {session?.roleLabels?.length ? (
        <section className="role-ribbon" aria-label="Discord roles">
          {session.roleLabels.slice(0, 8).map((label) => (
            <span className="pill" key={label}>
              {label}
            </span>
          ))}
        </section>
      ) : null}

      {children}
    </main>
  );
}
