export type Tier = {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  accent: string;
  badge: string;
  description: string;
  features: string[];
  restrictions?: string;
};

export const tiers: Tier[] = [
  {
    slug: "sinland-tierpackage-one",
    name: "Sinland-TierPackage-One",
    price: 5,
    priceLabel: "$5",
    accent: "#cf3f2f",
    badge: "Starter",
    description: "A quick jump-start for new names trying to make noise fast.",
    features: [
      "10 million in-game money",
      "5 free cars from qb-vehicleshop",
      "3 weapons of choice",
      "400 ammo for all three weapons chosen"
    ]
  },
  {
    slug: "sinland-tierpackage-two",
    name: "Sinland-TierPackage-Two",
    price: 15,
    priceLabel: "$15",
    accent: "#f38b2f",
    badge: "Hustler",
    description: "For players ready to move bigger and build a louder presence.",
    features: [
      "60 million in-game money",
      "15 free cars from qb-vehicleshop",
      "10 weapons of choice",
      "7000 ammo for all three weapons chosen"
    ]
  },
  {
    slug: "sinland-tierpackage-three",
    name: "Sinland-TierPackage-Three",
    price: 25,
    priceLabel: "$25",
    accent: "#f5ba36",
    badge: "Boss Move",
    description: "Heavy money, heavy firepower, and a fast lane into the city spotlight.",
    features: [
      "20 trillion in-game money",
      "20 free cars from qb-vehicleshop",
      "20 weapons of choice",
      "999999 ammo for all three weapons chosen"
    ]
  },
  {
    slug: "sinland-tierpackage-diamond-male-gender-only",
    name: "Sinland-TierPackage-Diamond-Male-gender-only",
    price: 50,
    priceLabel: "$50",
    accent: "#88d9ff",
    badge: "Diamond Male",
    description: "A top-shelf package for male characters who want full flex rights.",
    features: [
      "100 google plex million in-game money",
      "All cars from qb-vehicleshop free",
      "All weapons free of choice",
      "999999999 ammo for all three weapons chosen"
    ],
    restrictions: "Male characters only."
  },
  {
    slug: "sinland-tierpackage-diamond-female-gender-only",
    name: "Sinland-TierPackage-Diamond-Female-gender-only",
    price: 50,
    priceLabel: "$50",
    accent: "#ff78b0",
    badge: "Diamond Female",
    description: "A full-flex package for female characters with a custom Discord perk.",
    features: [
      "100 google plex million in-game money",
      "All cars from qb-vehicleshop free",
      "All weapons free of choice",
      "999999999 ammo for all three weapons chosen",
      "/baddie pre-equipped to female user in Discord when purchased"
    ],
    restrictions: "Female characters only."
  },
  {
    slug: "sinland-tierpackage-four",
    name: "Sinland-TierPackage-Four",
    price: 35,
    priceLabel: "$35",
    accent: "#9f5fff",
    badge: "Midnight",
    description: "Built for players who want more than starter status but not full diamond.",
    features: [
      "150 billion in-game money",
      "25 free cars from qb-vehicleshop",
      "12 weapons of choice",
      "25000 ammo for selected weapons"
    ]
  },
  {
    slug: "sinland-tierpackage-five",
    name: "Sinland-TierPackage-Five",
    price: 45,
    priceLabel: "$45",
    accent: "#54c7a6",
    badge: "Empire",
    description: "A business-and-crime blend package for players planning to run the city.",
    features: [
      "500 billion in-game money",
      "35 free cars from qb-vehicleshop",
      "15 weapons of choice",
      "75000 ammo for selected weapons"
    ]
  },
  {
    slug: "sinland-tierpackage-six",
    name: "Sinland-TierPackage-Six",
    price: 60,
    priceLabel: "$60",
    accent: "#e84f6a",
    badge: "Scarlet",
    description: "An aggressive upper-tier bundle for names that want instant recognition.",
    features: [
      "1 quadrillion in-game money",
      "50 free cars from qb-vehicleshop",
      "20 weapons of choice",
      "150000 ammo for selected weapons"
    ]
  },
  {
    slug: "sinland-tierpackage-seven",
    name: "Sinland-TierPackage-Seven",
    price: 75,
    priceLabel: "$75",
    accent: "#7ad7f0",
    badge: "Royal",
    description: "For power players looking to enter SinLand already feared and remembered.",
    features: [
      "5 quadrillion in-game money",
      "75 free cars from qb-vehicleshop",
      "25 weapons of choice",
      "500000 ammo for selected weapons"
    ]
  },
  {
    slug: "sinland-tierpackage-eight",
    name: "Sinland-TierPackage-Eight",
    price: 100,
    priceLabel: "$100",
    accent: "#ffffff",
    badge: "Legend",
    description: "The biggest public package tier on the storefront, built to stand out.",
    features: [
      "10 quadrillion in-game money",
      "All premium showcase cars from qb-vehicleshop",
      "30 weapons of choice",
      "1000000 ammo for selected weapons",
      "Priority staff review for reward fulfillment"
    ]
  },
  {
    slug: "sinland-tierpackage-nine",
    name: "Sinland-TierPackage-Nine",
    price: 150,
    priceLabel: "$150",
    accent: "#84ffcf",
    badge: "Overlord",
    description: "For players who want a near-unmatched launchpad into every scene in the city.",
    features: [
      "50 quadrillion in-game money",
      "All qb-vehicleshop cars unlocked",
      "35 weapons of choice",
      "2500000 ammo for selected weapons",
      "VIP reward handling priority"
    ]
  },
  {
    slug: "sinland-tierpackage-ten",
    name: "Sinland-TierPackage-Ten",
    price: 250,
    priceLabel: "$250",
    accent: "#ffdf7f",
    badge: "Immortal",
    description: "The highest custom storefront package, designed for all-out SinLand domination.",
    features: [
      "100 quadrillion in-game money",
      "All qb-vehicleshop cars free",
      "All weapons of choice",
      "9999999999 ammo support package",
      "White-glove fulfillment coordination through Discord"
    ]
  }
];
