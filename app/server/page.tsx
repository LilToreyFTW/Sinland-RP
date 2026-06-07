import { SiteChrome } from "@/components/SiteChrome";
import { getSession } from "@/lib/session";
import { getServerSnapshot } from "@/lib/server-data";

export default async function ServerPage() {
  const session = await getSession();
  const snapshot = getServerSnapshot();

  return (
    <SiteChrome session={session}>
      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Server Stack</span>
          <h2>Sinland-RP resource inventory</h2>
          <p>
            Every section below is driven from the FiveM resource folders currently on disk, including custom QBCore,
            mapped interiors, sound packs, responder tools, vehicles, and protection systems.
          </p>
        </div>

        <div className="category-stack">
          {snapshot.categories.map((category) => (
            <section className="category-panel" key={category.slug}>
              <div className="resource-top">
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
                <span className="pill">{category.resourceCount} resources</span>
              </div>
              <div className="server-list">
                {category.resources.map((resource) => (
                  <div className="server-row" key={`${category.slug}-${resource.name}`}>
                    <div>
                      <strong>{resource.name}</strong>
                      <span>{resource.hasManifest ? "fxmanifest detected" : "manifest missing"}</span>
                    </div>
                    <span>{resource.fileCount} files</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
