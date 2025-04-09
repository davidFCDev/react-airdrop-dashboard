// Mapas de colores tipados
export const statusColorMap: Record<
  Status,
  "success" | "warning" | "default" | "danger"
> = {
  Active: "success",
  Waiting: "warning",
  "Not Started": "default",
  Ended: "danger",
};

export const tierColorMap: Record<
  Tier,
  "success" | "primary" | "warning" | "danger"
> = {
  S: "success",
  A: "primary",
  B: "warning",
  C: "danger",
};

export const typeColorMap: Record<
  AirdropType,
  "success" | "primary" | "warning"
> = {
  "Play-to-Earn": "success",
  Testnet: "primary",
  "Farm tx": "warning",
};

export const costColorMap: Record<Cost, "success" | "warning" | "danger"> = {
  FREE: "success",
  "Gas Fees": "warning",
  Liquidity: "danger",
};

export const stageColorMap: Record<
  Stage,
  "primary" | "success" | "warning" | "default" | "danger"
> = {
  Testnet: "primary",
  Mainnet: "success",
  Beta: "warning",
  Alpha: "default",
  Closed: "danger",
  Open: "success",
  Private: "default",
  Public: "primary",
};

// Definición de columnas
interface Column {
  name: string;
  uid: keyof Airdrop | "links" | "tags";
  sortable?: boolean;
}

export const columns: Column[] = [
  { name: "Project Name", uid: "name", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Tier", uid: "tier", sortable: true },
  { name: "Funding", uid: "funding", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Cost", uid: "cost", sortable: true },
  { name: "Stage", uid: "stage", sortable: true },
  { name: "Chain", uid: "chain", sortable: true },
  { name: "Tags", uid: "tags" },
  { name: "Links", uid: "links" },
  { name: "Created", uid: "created_at", sortable: true },
  { name: "Last Edited", uid: "last_edited", sortable: true },
];

// Definición de tipos
export const types = ["Play-to-Earn", "Testnet", "Farm tx"] as const;
export const tiers = ["S", "A", "B", "C"] as const;
export const stages = [
  "Testnet",
  "Mainnet",
  "Beta",
  "Alpha",
  "Closed",
  "Open",
  "Private",
  "Public",
] as const;
export const status = ["Active", "Waiting", "Not Started", "Ended"] as const;
export const cost = ["FREE", "Gas Fees", "Liquidity"] as const;

export type AirdropType = (typeof types)[number];
export type Tier = (typeof tiers)[number];
export type Stage = (typeof stages)[number];
export type Status = (typeof status)[number];
export type Cost = (typeof cost)[number];

export interface Airdrop {
  name: string;
  description: string;
  type: AirdropType;
  tier: Tier;
  status: Status;
  stage: Stage;
  progress: number;
  funding: string;
  cost: Cost;
  chain: string;
  tags: string[];
  created_at: string;
  last_edited: string;
  image: string;
  url: string;
  discord: string;
  twitter: string;
  telegram: string;
  user: {
    important_links: string[];
    tasks: string[];
  };
}

export const AIRDROP_LIST: Airdrop[] = [
  {
    name: "77BIT",
    description: "2 months campaign",
    type: types[0], // "Play-to-Earn"
    tier: tiers[0], // "S"
    status: status[0], // "Active"
    stage: stages[0], // "Testnet"
    progress: 50,
    funding: "50m",
    cost: cost[0], // "FREE"
    chain: "Abstract",
    tags: ["L2", "NFT", "GameFi"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image:
      "https://pbs.twimg.com/profile_images/1712518219271942144/bBIxPoV6_400x400.jpg",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    user: {
      important_links: ["https://example.com", "https://example.com"],
      tasks: ["Daily Check-in", "Referral Program"],
    },
  },
  {
    name: "TOWNS",
    description: "3 months campaign",
    type: types[1], // "Testnet"
    tier: tiers[1], // "A"
    status: status[1], // "Waiting"
    stage: stages[1], // "Mainnet"
    progress: 60,
    funding: "60m",
    cost: cost[1], // "Gas Fees"
    chain: "Polygon",
    tags: ["L2", "NFT", "GameFi"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image:
      "https://pbs.twimg.com/profile_images/1893500934086438912/yImUvwK__400x400.png",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    user: {
      important_links: ["https://example.com", "https://example.com"],
      tasks: ["Daily Check-in", "Referral Program"],
    },
  },
  {
    name: "OPTIMISM",
    description: "3 months campaign",
    type: types[0], // "Testnet"
    tier: tiers[2], // "A"
    status: status[0], // "Waiting"
    stage: stages[1], // "Mainnet"
    progress: 60,
    funding: "60m",
    cost: cost[1], // "Gas Fees"
    chain: "Optimism",
    tags: ["L2", "NFT", "Superchain"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/11840.png",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    user: {
      important_links: ["https://example.com", "https://example.com"],
      tasks: ["Daily Check-in", "Referral Program"],
    },
  },
];
