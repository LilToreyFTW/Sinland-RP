import fs from "node:fs";
import path from "node:path";

export type ResourceCategory = {
  slug: string;
  title: string;
  path: string;
  description: string;
};

export type ResourceEntry = {
  name: string;
  path: string;
  hasManifest: boolean;
  fileCount: number;
};

export type ResourceCategorySnapshot = ResourceCategory & {
  resourceCount: number;
  resources: ResourceEntry[];
};

export type VehicleEntry = {
  id: string;
  resourceName: string;
  resourcePath: string;
  modelName: string;
  gameName: string;
  handlingId: string;
  sourceMeta: string;
  previewPath: string | null;
};

export type ServerSnapshot = {
  categories: ResourceCategorySnapshot[];
  featuredSystems: ResourceEntry[];
  vehicles: VehicleEntry[];
  totalResources: number;
};

const resourcesRoot =
  process.env.SINLAND_RESOURCES_ROOT ||
  "C:\\Users\\Administrator\\Desktop\\V2\\txData\\QBCore_0EAEB9.base\\resources";

const vehiclePreviewRoot =
  process.env.SINLAND_VEHICLE_PREVIEW_ROOT || path.join(process.cwd(), "public", "vehicle-previews");

const categories: ResourceCategory[] = [
  {
    slug: "qb-core",
    title: "QBCore Base",
    path: "[qb]",
    description: "Core framework jobs, economy, housing, police, inventory, and city systems."
  },
  {
    slug: "qb-custom",
    title: "QBCore Custom",
    path: "[qb-sinland]",
    description: "Custom QBCore add-ons for businesses, activities, crimes, and premium server flavor."
  },
  {
    slug: "sinland-core",
    title: "Sinland Core",
    path: "[sinland]",
    description: "Sinland-branded systems, criminal progression, wilderness play, garages, HUD, and admin tools."
  },
  {
    slug: "sinland-scripts",
    title: "Sinland Scripts",
    path: "[sinland-scripts]",
    description: "Lifestyle, gang, weapon, map, and immersion scripts used around the city."
  },
  {
    slug: "sinland-scriptsv2",
    title: "Sinland Scripts V2",
    path: "[sinland-scriptsv2]",
    description: "Utility and emergency support tools for staff and responder gameplay."
  },
  {
    slug: "sinland-scriptsv3",
    title: "Sinland Scripts V3",
    path: "[sinland-scriptsv3]",
    description: "Responder, rescue, robbery, roadside, and policing feature set."
  },
  {
    slug: "discord",
    title: "Discord Systems",
    path: "[sinland-discord-scripts]",
    description: "Discord role sync, tags, whitelist, vehicle trust, and permission bridges."
  },
  {
    slug: "cars",
    title: "Vehicle Packs",
    path: "[sinland-cars-v2]",
    description: "Custom cars, bikes, exotic builds, and tuned packs running in the live server."
  },
  {
    slug: "rmods",
    title: "RMod Vehicles",
    path: "[sinland-rmods]",
    description: "Performance-oriented vehicle mod packs, including police and exotic variants."
  },
  {
    slug: "mlos",
    title: "MLOs",
    path: "[sinland-mlos]",
    description: "Mapped interiors and world spaces that shape the Sinland city experience."
  },
  {
    slug: "soundpacks",
    title: "Sound Packs",
    path: "[soundpacks2]",
    description: "Sound replacements and audio resources used to sharpen the in-city feel."
  },
  {
    slug: "controller",
    title: "Controller Scripts",
    path: "[controller-scripts]",
    description: "Controller support utilities and helper scripts."
  },
  {
    slug: "t2026",
    title: "2026 Pack",
    path: "[Sinland-T's2026Pack]",
    description: "Extended Sinland content pack with custom assets and bundled gameplay resources."
  }
];

const featuredSystemFolders = ["sinland-copyright", "sinland-encrytion"];

function safeReadDir(dirPath: string) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function fileCountForDir(dirPath: string) {
  const stack = [dirPath];
  let count = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    for (const entry of safeReadDir(current)) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else {
        count += 1;
      }
    }
  }

  return count;
}

function getCategorySnapshot(category: ResourceCategory): ResourceCategorySnapshot {
  const absolute = path.join(resourcesRoot, category.path);
  const resources = safeReadDir(absolute)
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const resourcePath = path.join(absolute, entry.name);
      const manifestPath = path.join(resourcePath, "fxmanifest.lua");

      return {
        name: entry.name,
        path: resourcePath,
        hasManifest: fs.existsSync(manifestPath),
        fileCount: fileCountForDir(resourcePath)
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    ...category,
    resourceCount: resources.length,
    resources
  };
}

function getFeaturedSystems() {
  return featuredSystemFolders
    .map((folderName) => {
      const resourcePath = path.join(resourcesRoot, folderName);
      if (!fs.existsSync(resourcePath)) {
        return null;
      }

      return {
        name: folderName,
        path: resourcePath,
        hasManifest: fs.existsSync(path.join(resourcePath, "fxmanifest.lua")),
        fileCount: fileCountForDir(resourcePath)
      } satisfies ResourceEntry;
    })
    .filter((entry): entry is ResourceEntry => Boolean(entry));
}

function previewForVehicle(resourceName: string, modelName: string) {
  const candidates = [
    `${resourceName}.png`,
    `${resourceName}.jpg`,
    `${modelName}.png`,
    `${modelName}.jpg`
  ];

  for (const candidate of candidates) {
    const absolute = path.join(vehiclePreviewRoot, candidate);
    if (fs.existsSync(absolute)) {
      return `/vehicle-previews/${candidate}`;
    }
  }

  return null;
}

function getTagValue(source: string, tagName: string) {
  const match = source.match(new RegExp(`<${tagName}>([^<]+)</${tagName}>`, "i"));
  return match?.[1]?.trim() || "";
}

function getVehicles() {
  const vehiclesDir = path.join(resourcesRoot, "[sinland-cars-v2]");
  const resourceDirs = safeReadDir(vehiclesDir).filter((entry) => entry.isDirectory());
  const vehicles: VehicleEntry[] = [];

  for (const entry of resourceDirs) {
    const resourcePath = path.join(vehiclesDir, entry.name);
    const metaFiles = safeReadDir(resourcePath)
      .filter((child) => child.isFile() && child.name.endsWith(".meta") && child.name.includes("vehicles"))
      .map((child) => path.join(resourcePath, child.name));

    for (const metaFile of metaFiles) {
      const source = fs.readFileSync(metaFile, "utf8");
      const chunks = source.split("<Item type=\"CHandlingData\">");

      if (chunks.length > 1) {
        continue;
      }

      const itemBlocks = source.split(/<Item>|<Item type="CVehicleModelInfoVariation">/).slice(1);
      let itemIndex = 0;

      for (const block of itemBlocks) {
        const modelName = getTagValue(block, "modelName");
        const gameName = getTagValue(block, "gameName");
        const handlingId = getTagValue(block, "handlingId");

        if (!modelName && !gameName) {
          continue;
        }

        itemIndex += 1;
        vehicles.push({
          id: `${entry.name}-${modelName || gameName || itemIndex}`.toLowerCase(),
          resourceName: entry.name,
          resourcePath,
          modelName: modelName || entry.name,
          gameName: gameName || modelName || entry.name,
          handlingId: handlingId || "n/a",
          sourceMeta: metaFile,
          previewPath: previewForVehicle(entry.name, modelName || gameName || entry.name)
        });
      }
    }
  }

  return vehicles.sort((a, b) => a.gameName.localeCompare(b.gameName));
}

export function getServerSnapshot(): ServerSnapshot {
  const categorySnapshots = categories.map(getCategorySnapshot);
  const featuredSystems = getFeaturedSystems();
  const vehicles = getVehicles();

  return {
    categories: categorySnapshots,
    featuredSystems,
    vehicles,
    totalResources: categorySnapshots.reduce((total, category) => total + category.resourceCount, 0)
  };
}
