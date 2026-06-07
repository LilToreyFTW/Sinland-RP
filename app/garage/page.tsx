import { SiteChrome } from "@/components/SiteChrome";
import { getSession } from "@/lib/session";
import { getServerSnapshot } from "@/lib/server-data";

export default async function GaragePage() {
  const session = await getSession();
  const { vehicles } = getServerSnapshot();

  return (
    <SiteChrome session={session}>
      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Vehicle Catalog</span>
          <h2>Actual in-server car and bike models.</h2>
          <p>
            This garage page is built from the live vehicle resource metadata inside the server so players can browse
            the same models and spawn names the city actually runs.
          </p>
        </div>
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <article className="vehicle-card" key={vehicle.id}>
              <div className={`vehicle-visual${vehicle.previewPath ? " has-image" : ""}`}>
                {vehicle.previewPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vehicle.previewPath} alt={vehicle.gameName} />
                ) : (
                  <div className="vehicle-fallback">
                    <span>{vehicle.gameName}</span>
                    <small>Preview image not bundled in server files</small>
                  </div>
                )}
              </div>
              <div className="vehicle-copy">
                <div className="thread-top">
                  <span className="pill">{vehicle.resourceName}</span>
                  <span className="muted-copy">{vehicle.handlingId}</span>
                </div>
                <h3>{vehicle.gameName}</h3>
                <div className="spec-list">
                  <div>
                    <span>Model</span>
                    <strong>{vehicle.modelName}</strong>
                  </div>
                  <div>
                    <span>Meta</span>
                    <strong>{vehicle.sourceMeta.split("\\").slice(-1)[0]}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
