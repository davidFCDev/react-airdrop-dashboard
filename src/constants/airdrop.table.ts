export const statusColorMap: Record<
  Status,
  "success" | "warning" | "default" | "danger"
> = {
  Confirmed: "success",
  "Not Confirmed": "warning",
  Posible: "default",
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
  "success" | "primary" | "warning" | "secondary" | "danger"
> = {
  "Play-to-Earn": "success",
  "Points System": "primary",
  Testnet: "secondary",
  "Farm tx": "warning",
  Trading: "danger",
};

export const costColorMap: Record<
  Cost,
  "success" | "warning" | "danger" | "primary"
> = {
  FREE: "success",
  "FREE/Optional Cost": "primary",
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
  uid: keyof Airdrop | "links" | "tags" | "favorite" | "actions";
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
  { name: "Favorite", uid: "favorite", sortable: false },
  { name: "Actions", uid: "actions", sortable: false },
];

// Definición de tipos
export const types = [
  "Play-to-Earn",
  "Testnet",
  "Farm tx",
  "Trading",
  "Points System",
] as const;
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
export const status = [
  "Confirmed",
  "Not Confirmed",
  "Posible",
  "Ended",
] as const;
export const cost = [
  "FREE",
  "FREE/Optional Cost",
  "Gas Fees",
  "Liquidity",
] as const;

export type AirdropType = (typeof types)[number];
export type Tier = (typeof tiers)[number];
export type Stage = (typeof stages)[number];
export type Status = (typeof status)[number];
export type Cost = (typeof cost)[number];

export interface Airdrop {
  id: string;
  name: string;
  description: { en: string; es: string };
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
  status: Status;
  important_links: { key: string; value: string }[];
  user: {
    daily_tasks: { en: string; es: string }[];
    general_tasks: { en: string; es: string }[];
    notes: { id: string; text: string; created_at: string }[];
  };
}
