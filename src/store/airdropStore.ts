import { collection, onSnapshot, query, where } from "firebase/firestore";
import { create } from "zustand";

import { Airdrop } from "@/constants/airdrop.table";
import { db } from "@/lib/firebase";
import { airdropService } from "@/service/airdrop.service";

interface AirdropState {
  airdrops: Airdrop[];
  favorites: Set<string>;
  updatingFavorites: Set<string>;
  error: string | null;
  loading: boolean;
  fetchAirdrops: () => () => void;
  fetchFavorites: (uid: string) => () => void;
  deleteAirdrop: (id: string) => Promise<void>;
  toggleFavorite: (airdropId: string, favorite: boolean) => Promise<void>;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => Promise<void>;
}

export const useAirdropStore = create<AirdropState>((set) => ({
  airdrops: [],
  favorites: new Set(),
  updatingFavorites: new Set(),
  error: null,
  loading: true,

  fetchAirdrops: () => {
    const q = query(collection(db, "airdrops"));
    const unsubscribe = onSnapshot(
      q,
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
        })) as Airdrop[];

        set({ airdrops: airdropData, loading: false });
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
    const userAirdropsRef = collection(db, "user_airdrops", uid, "airdrops");
    const favQuery = query(userAirdropsRef, where("favorite", "==", true));
    const unsubscribeFavorites = onSnapshot(
      favQuery,
      (snapshot) => {
        const favoriteIds = new Set<string>(snapshot.docs.map((doc) => doc.id));

        set({ favorites: favoriteIds });
      },
      (err) => {
        set({ error: `Error fetching favorites: ${err.message}` });
      },
    );

    return unsubscribeFavorites;
  },

  deleteAirdrop: async (id: string) => {
    try {
      await airdropService.deleteAirdrop(id);
      set((state) => ({
        airdrops: state.airdrops.filter((a) => a.id !== id),
      }));
    } catch (err) {
      set({
        error: `Error deleting airdrop: ${
          err instanceof Error ? err.message : "Unknown"
        }`,
      });
    }
  },

  toggleFavorite: async (airdropId: string, favorite: boolean) => {
    try {
      set((state) => ({
        updatingFavorites: new Set(state.updatingFavorites).add(airdropId),
      }));

      const airdrop = await airdropService.getAirdrop(airdropId);

      if (!airdrop) throw new Error("Airdrop not found");

      await airdropService.initializeUserAirdrop(airdropId);
      await airdropService.toggleFavorite(airdropId, favorite);

      set((state) => {
        const newFavorites = new Set(state.favorites);

        if (favorite) {
          newFavorites.add(airdropId);
        } else {
          newFavorites.delete(airdropId);
        }

        return { favorites: newFavorites };
      });
    } catch (err) {
      set({
        error: `Error toggling favorite: ${
          err instanceof Error ? err.message : "Unknown"
        }`,
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
        error: `Error updating airdrop: ${
          err instanceof Error ? err.message : "Unknown"
        }`,
      });
    }
  },
}));
