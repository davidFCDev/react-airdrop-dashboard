/* eslint-disable no-console */
import {
  collection,
  limit,
  onSnapshot,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { create } from "zustand";

import { db } from "@/lib/firebase";
import { airdropService } from "@/service/airdrop.service";
import { tgeService } from "@/service/tge.service";
import { Airdrop, UserAirdropData } from "@/types";

interface TGEAssignment {
  airdropId: string;
  airdropName: string;
  airdropImage: string;
}

interface AirdropState {
  airdrops: Airdrop[];
  trackedAirdrops: Set<string>;
  userAirdropData: Map<string, UserAirdropData>;
  updatingFavorites: Set<string>;
  tgeAssignments: Map<string, TGEAssignment[]>;
  error: string | null;
  loading: boolean;
  fetchAirdrops: () => Unsubscribe;
  fetchFavorites: (uid: string) => Unsubscribe;
  fetchTGEAssignments: (year: number, month: number) => Unsubscribe;
  assignTGE: (date: string, airdrop: Airdrop) => Promise<void>;
  removeTGE: (date: string, airdropId: string) => Promise<void>;
  deleteAirdrop: (id: string) => Promise<void>;
  toggleTracking: (airdropId: string, favorite: boolean) => Promise<void>;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => Promise<void>;
}

export const useAirdropStore = create<AirdropState>((set, get) => ({
  airdrops: [],
  trackedAirdrops: new Set(),
  userAirdropData: new Map(),
  updatingFavorites: new Set(),
  tgeAssignments: new Map(),
  error: null,
  loading: true,

  fetchAirdrops: () => {
    const q = query(collection(db, "airdrops"), limit(50));
    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        const airdropData: Airdrop[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at
            ? new Date(doc.data().created_at).toISOString()
            : new Date().toISOString(),
          last_edited: doc.data().last_edited
            ? new Date(doc.data().last_edited).toISOString()
            : new Date().toISOString(),
          image: doc.data().image || "",
          name: doc.data().name || "",
          confirmation: doc.data().confirmation || "Not Confirmed",
        })) as Airdrop[];

        set((state) => ({
          airdrops: airdropData,
          loading:
            state.userAirdropData.size === 0 &&
            state.trackedAirdrops.size === 0 &&
            state.tgeAssignments.size === 0 &&
            airdropData.length === 0,
        }));
      },
      (err) => {
        set({
          error: `Error fetching airdrops: ${err.message}`,
          loading: false,
        });
      },
    );

    return unsubscribe;
  },

  fetchFavorites: (uid: string) => {
    console.log("fetchFavorites started for UID:", uid);
    const userAirdropsRef = collection(db, "user_airdrops", uid, "airdrops");
    const unsubscribeFavorites = onSnapshot(
      userAirdropsRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const favoriteIds = new Set<string>();
        const userData = new Map<string, UserAirdropData>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data() as UserAirdropData;

          console.log(`fetchFavorites: Airdrop ${doc.id}:`, {
            invested: data.invested,
            favorite: data.favorite,
          });
          userData.set(doc.id, data);
          if (data.favorite) {
            favoriteIds.add(doc.id);
          }
        });
        set((state) => ({
          trackedAirdrops: favoriteIds,
          userAirdropData: userData,
          loading:
            state.airdrops.length === 0 &&
            favoriteIds.size === 0 &&
            state.tgeAssignments.size === 0 &&
            userData.size === 0,
        }));
      },
      (err) => {
        set({
          error: `Error fetching favorites: ${err.message}`,
          loading: false,
        });
      },
    );

    return unsubscribeFavorites;
  },

  fetchTGEAssignments: (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    const tgeRef = collection(db, "tge_assignments");
    const q = query(tgeRef);

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      async (snapshot) => {
        const assignments = new Map<string, TGEAssignment[]>();

        for (const doc of snapshot.docs) {
          const date = doc.id;

          if (date >= startDate && date <= endDate) {
            const data = doc.data().airdrops as TGEAssignment[];

            assignments.set(date, data || []);
          }
        }
        set({ tgeAssignments: assignments });
      },
      (err) => {
        set({
          error: `Error fetching TGE assignments: ${err.message}`,
        });
      },
    );

    return unsubscribe;
  },

  assignTGE: async (date: string, airdrop: Airdrop) => {
    try {
      await tgeService.assignAirdropToDate(date, airdrop);
      set((state) => {
        const newAssignments = new Map(state.tgeAssignments);
        const current = newAssignments.get(date) || [];

        newAssignments.set(date, [
          ...current,
          {
            airdropId: airdrop.id,
            airdropName: airdrop.name,
            airdropImage: airdrop.image || "",
          },
        ]);

        return { tgeAssignments: newAssignments };
      });
    } catch (err) {
      set({
        error: `Error assigning TGE: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  },

  removeTGE: async (date: string, airdropId: string) => {
    try {
      await tgeService.removeAirdropFromDate(date, airdropId);
      set((state) => {
        const newAssignments = new Map(state.tgeAssignments);
        const current = newAssignments.get(date) || [];

        newAssignments.set(
          date,
          current.filter((a) => a.airdropId !== airdropId),
        );

        return { tgeAssignments: newAssignments };
      });
    } catch (err) {
      set({
        error: `Error removing TGE: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  },

  deleteAirdrop: async (id: string) => {
    try {
      await airdropService.deleteAirdrop(id);
      set((state) => ({
        airdrops: state.airdrops.filter((a) => a.id !== id),
      }));
    } catch (err) {
      set({
        error: `Error deleting airdrop: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  },

  toggleTracking: async (airdropId: string, favorite: boolean) => {
    try {
      set((state) => ({
        updatingFavorites: new Set(state.updatingFavorites).add(airdropId),
      }));

      const airdrop = await airdropService.getAirdrop(airdropId);

      if (!airdrop) throw new Error("Airdrop not found");

      await airdropService.initializeUserAirdrop(airdropId);
      await airdropService.toggleFavorite(airdropId, favorite);

      set((state) => {
        const newFavorites = new Set(state.trackedAirdrops);

        if (favorite) {
          newFavorites.add(airdropId);
        } else {
          newFavorites.delete(airdropId);
        }

        return { trackedAirdrops: newFavorites };
      });
    } catch (err) {
      set({
        error: `Error toggling favorite: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    } finally {
      set((state) => {
        const newUpdating = new Set(state.updatingFavorites);

        newUpdating.delete(airdropId);

        return { updatingFavorites: newUpdating };
      });
    }
  },

  updateAirdrop: async (id: string, airdrop: Partial<Airdrop>) => {
    try {
      await airdropService.updateAirdrop(id, airdrop);
      set((state) => ({
        airdrops: state.airdrops.map((a) =>
          a.id === id ? { ...a, ...airdrop } : a,
        ),
      }));
    } catch (err) {
      set({
        error: `Error updating airdrop: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  },
}));
