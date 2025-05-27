import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Post {
  id: string;
  image: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
  links: { key: string; value: string }[];
  created_at: string;
  last_edited: string;
}

// Airdrop types
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
export const status = ["Active", "Waiting", "Finished"] as const;
export const confirmation = [
  "Confirmed",
  "Not Confirmed",
  "Possible",
  "Ended",
] as const;
export const cost = ["FREE", "Low Cost", "Gas Fees", "Liquidity"] as const;

export type AirdropType = (typeof types)[number];
export type Tier = (typeof tiers)[number];
export type Stage = (typeof stages)[number];
export type Status = (typeof status)[number];
export type Confirmation = (typeof confirmation)[number];
export type Cost = (typeof cost)[number];

export type ImportantLink = {
  key: string;
  value: string;
};

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
  confirmation: Confirmation;
  important_links: { key: string; value: string }[];
  user: {
    daily_tasks: { en: string; es: string }[];
    general_tasks: { en: string; es: string }[];
    notes: { id: string; text: string; created_at: string }[];
  };
}

export interface FavoriteAirdrop {
  id: string;
  name: string;
  description: { en: string; es: string };
  type: string;
  tier: string;
  stage: string;
  funding: string;
  cost: string;
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
  status: string;
  confirmation: string;
  important_links: { key: string; value: string }[];
  user: {
    daily_tasks: { en: string; es: string }[];
    general_tasks: { en: string; es: string }[];
    notes: { id: string; text: string; created_at: string }[];
  };
  daily_tasks: TaskStatus[];
  general_tasks: TaskStatus[];
}

export interface AirdropSummary {
  totalDailyTasks: number;
  completedDailyTasks: number;
  totalGeneralTasks: number;
  completedGeneralTasks: number;
  totalTasks: number;
  completedTasks: number;
}

export interface TaskStatus {
  id: string;
  completed: boolean;
}

export interface UserAirdropData {
  favorite: boolean;
  daily_tasks: TaskStatus[];
  general_tasks: TaskStatus[];
  notes: Note[];
  invested: number;
  received: number;
}

export interface Note {
  id: string;
  text: string;
  created_at: string;
}

export interface AirdropNotesProps {
  handleAddNote: () => void;
  newNote: string;
  notes: Note[];
  removeNote: (id: string) => void;
  setNewNote: (value: string) => void;
  invested: number;
  received: number;
  updateInvestment: (invested: number, received: number) => void;
}

export interface AirdropState {
  airdrops: Airdrop[];
  trackedAirdrops: Set<string>;
  userAirdropData: Map<string, UserAirdropData>;
  updatingFavorites: Set<string>;
  error: string | null;
  loading: boolean;
  fetchAirdrops: () => () => void;
  fetchFavorites: (uid: string) => () => void;
  deleteAirdrop: (id: string) => Promise<void>;
  toggleTracking: (airdropId: string, favorite: boolean) => Promise<void>;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => Promise<void>;
}
