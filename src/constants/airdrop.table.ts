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
  id: string;
  name: string;
  description: string;
  type: AirdropType;
  tier: Tier;
  stage: Stage;
  funding: string;
  cost: Cost;
  chain: string;
  tags: string[];
  created_at: string;
  last_edited: string;
  image: string;
  backdrop: string;
  url: string;
  discord: string;
  twitter: string;
  telegram: string;
  status: Status; // Restaurado
  important_links: { key: string; value: string }[];
  user: {
    daily_tasks: string[];
    general_tasks: string[];
    notes: string[];
  };
}

export const AIRDROP_LIST: Airdrop[] = [
  {
    id: "1",
    name: "77BIT",
    description:
      "77BIT is a decentralized gaming platform that allows players to earn rewards through gameplay. The platform features a variety of games, including strategy, action, and puzzle games, all of which are designed to be fun and engaging while also providing opportunities for players to earn cryptocurrency.",
    type: "Play-to-Earn",
    tier: "S",
    stage: "Testnet",
    funding: "50m",
    cost: "FREE",
    chain: "Abstract",
    tags: ["L2", "NFT", "GameFi"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image:
      "https://pbs.twimg.com/profile_images/1712518219271942144/bBIxPoV6_400x400.jpg",
    backdrop:
      "https://gam3s.gg/_next/image/?url=https%3A%2F%2Fassets.gam3s.gg%2F77_bit_Game_Image_1_fab6256b69.png&w=3840&q=75",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    status: "Active", // Restaurado
    important_links: [
      { key: "Faucet", value: "https://faucet.77bit.com" },
      { key: "Docs", value: "https://docs.77bit.com" },
    ],
    user: {
      daily_tasks: ["Daily Check-in", "Tweet about 77BIT"],
      general_tasks: ["Join Discord", "Referral Program"],
      notes: [],
    },
  },
  {
    id: "2",
    name: "TOWNS",
    description: "2 months campaign",
    type: "Play-to-Earn",
    tier: "S",
    stage: "Testnet",
    funding: "50m",
    cost: "FREE",
    chain: "Abstract",
    tags: ["L2", "NFT", "GameFi"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image:
      "https://pbs.twimg.com/profile_images/1893500934086438912/yImUvwK__400x400.png",
    backdrop:
      "https://gam3s.gg/_next/image/?url=https%3A%2F%2Fassets.gam3s.gg%2F77_bit_Game_Image_1_fab6256b69.png&w=3840&q=75",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    status: "Active", // Restaurado
    important_links: [
      { key: "Faucet", value: "https://faucet.77bit.com" },
      { key: "Docs", value: "https://docs.77bit.com" },
    ],
    user: {
      daily_tasks: ["Daily Check-in", "Tweet about 77BIT"],
      general_tasks: ["Join Discord", "Referral Program"],
      notes: [],
    },
  },
  {
    id: "3",
    name: "OPTIMISM",
    description: "2 months campaign",
    type: "Play-to-Earn",
    tier: "S",
    stage: "Testnet",
    funding: "50m",
    cost: "FREE",
    chain: "Abstract",
    tags: ["L2", "NFT", "GameFi"],
    created_at: "2023-10-01",
    last_edited: "2023-10-01",
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/11840.png",
    backdrop:
      "https://gam3s.gg/_next/image/?url=https%3A%2F%2Fassets.gam3s.gg%2F77_bit_Game_Image_1_fab6256b69.png&w=3840&q=75",
    url: "https://example.com",
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
    telegram: "https://t.me/example",
    status: "Active", // Restaurado
    important_links: [
      { key: "Faucet", value: "https://faucet.77bit.com" },
      { key: "Docs", value: "https://docs.77bit.com" },
    ],
    user: {
      daily_tasks: ["Daily Check-in", "Tweet about 77BIT"],
      general_tasks: ["Join Discord", "Referral Program"],
      notes: [],
    },
  },
];
