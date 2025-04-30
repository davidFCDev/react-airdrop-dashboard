import { Airdrop, AirdropType, Cost, Stage, Status, Tier } from "@/types";

export const statusColorMap: Record<Status, "success" | "warning" | "danger"> =
  {
    Confirmed: "success",
    "Not Confirmed": "warning",
    Posible: "warning",
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
  "Low Cost": "warning",
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
