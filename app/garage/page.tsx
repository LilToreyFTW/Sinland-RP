import { SiteChrome } from "@/components/SiteChrome";
import { getSession } from "@/lib/session";
import { getServerSnapshot } from "@/lib/server-data";

function formatCategoryLabel(category: string) {
  if (category === "T's2026Pack") {
    return "T's 2026 Pack";
  }

  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

export default async function GaragePage() {
  const session = await getSession();
  const { qbVehicleCatalog, qbVehicleShops } = getServerSnapshot();

  const categoryCounts = Array.from(
    qbVehicleCatalog.reduce((map, vehicle) => {
      map.set(vehicle.category, (map.get(vehicle.category) || 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const showroomModels = new Set(qbVehicleShops.flatMap((shop) => shop.showroomVehicles.map((model) => model.toLowerCase())));
  const featuredShowroomVehicles = qbVehicleCatalog.filter((vehicle) => showroomModels.has(vehicle.model.toLowerCase()));

  return (
    <SiteChrome session={session}>
      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">QBCore Vehicle Shop</span>
          <h2>Live `qb-vehicleshop` inventory is now surfaced here.</h2>
          <p>
            This garage page now reads the real vehicle catalog from `qb-core/shared/vehicles.lua` and the live
            showroom/shop layout from `qb-vehicleshop/config.lua`, so the web view reflects what Sinland actually sells.
          </p>
        </div>

        <div className="garage-stat-grid">
          <div className="mini-card">
            <span className="metric-label">Vehicles Listed</span>
            <strong>{qbVehicleCatalog.length}</strong>
          </div>
          <div className="mini-card">
            <span className="metric-label">Active Shops</span>
            <strong>{qbVehicleShops.length}</strong>
          </div>
          <div className="mini-card">
            <span className="metric-label">Showroom Slots</span>
            <strong>{qbVehicleShops.reduce((count, shop) => count + shop.showroomVehicles.length, 0)}</strong>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Shop Floors</span>
          <h2>Every configured dealership is mirrored from the server.</h2>
          <p>Players can see which shops exist, how they operate, and which categories each one actually sells.</p>
        </div>

        <div className="resource-grid two-up">
          {qbVehicleShops.map((shop) => (
            <article className="resource-card" key={shop.key}>
              <div className="resource-top">
                <h3>{shop.label}</h3>
                <span className="pill">{shop.type}</span>
              </div>
              <div className="spec-list">
                <div>
                  <span>Shop Key</span>
                  <strong>{shop.key}</strong>
                </div>
                <div>
                  <span>Required Job</span>
                  <strong>{shop.job}</strong>
                </div>
              </div>
              <div className="chip-row">
                {shop.categories.map((category) => (
                  <span className="tiny-chip" key={`${shop.key}-${category}`}>
                    {formatCategoryLabel(category)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Live Showroom</span>
          <h2>Current display models from the configured showroom pads.</h2>
          <p>These are the chosen showcase vehicles currently defined in the shop config for the live server.</p>
        </div>

        <div className="vehicle-grid">
          {featuredShowroomVehicles.map((vehicle) => (
            <article className="vehicle-card" key={`showroom-${vehicle.id}`}>
              <div className={`vehicle-visual${vehicle.previewPath ? " has-image" : ""}`}>
                {vehicle.previewPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vehicle.previewPath} alt={vehicle.name} />
                ) : (
                  <div className="vehicle-fallback">
                    <span>{vehicle.name}</span>
                    <small>No bundled preview image was found for this vehicle model.</small>
                  </div>
                )}
              </div>
              <div className="vehicle-copy">
                <div className="thread-top">
                  <span className="pill">Showroom</span>
                  <span className="muted-copy">{formatPrice(vehicle.price)}</span>
                </div>
                <h3>{vehicle.name}</h3>
                <div className="spec-list">
                  <div>
                    <span>Model</span>
                    <strong>{vehicle.model}</strong>
                  </div>
                  <div>
                    <span>Brand</span>
                    <strong>{vehicle.brand}</strong>
                  </div>
                  <div>
                    <span>Category</span>
                    <strong>{formatCategoryLabel(vehicle.category)}</strong>
                  </div>
                  <div>
                    <span>Type</span>
                    <strong>{vehicle.type}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Category Spread</span>
          <h2>Most populated categories in the real shop catalog.</h2>
          <p>The category counts below are generated from the same shared vehicle list QBCore uses for the shop menu.</p>
        </div>

        <div className="resource-grid">
          {categoryCounts.map(([category, count]) => (
            <article className="resource-card" key={category}>
              <div className="resource-top">
                <h3>{formatCategoryLabel(category)}</h3>
                <span className="pill">{count} listed</span>
              </div>
              <p>
                Available through the live `qb-vehicleshop` stack and pulled directly from the shared vehicle registry.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="section-kicker">Full Catalog</span>
          <h2>Every `qb-vehicleshop` sale entry currently configured for Sinland-RP.</h2>
          <p>
            This is the real website-side browse view of the QBCore vehicle shop inventory, including pricing, category,
            vehicle type, and shop availability.
          </p>
        </div>

        <div className="vehicle-grid">
          {qbVehicleCatalog.map((vehicle) => (
            <article className="vehicle-card" key={vehicle.id}>
              <div className={`vehicle-visual${vehicle.previewPath ? " has-image" : ""}`}>
                {vehicle.previewPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vehicle.previewPath} alt={vehicle.name} />
                ) : (
                  <div className="vehicle-fallback">
                    <span>{vehicle.name}</span>
                    <small>No bundled preview image was found for this vehicle model.</small>
                  </div>
                )}
              </div>
              <div className="vehicle-copy">
                <div className="thread-top">
                  <span className="pill">{formatCategoryLabel(vehicle.category)}</span>
                  <span className="muted-copy">{formatPrice(vehicle.price)}</span>
                </div>
                <h3>{vehicle.name}</h3>
                <div className="spec-list">
                  <div>
                    <span>Model</span>
                    <strong>{vehicle.model}</strong>
                  </div>
                  <div>
                    <span>Brand</span>
                    <strong>{vehicle.brand}</strong>
                  </div>
                  <div>
                    <span>Type</span>
                    <strong>{vehicle.type}</strong>
                  </div>
                  <div>
                    <span>Shops</span>
                    <strong>{vehicle.shops.join(", ")}</strong>
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
