/* eslint-disable no-console */
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Airdrop } from "@/types";

interface TGEAirdrop {
  airdropId: string;
  airdropName: string;
  airdropImage: string;
}

export class TGEService {
  async assignAirdropToDate(date: string, airdrop: Airdrop): Promise<void> {
    try {
      const tgeRef = doc(db, "tge_assignments", date);
      const docSnap = await getDoc(tgeRef);
      const newAirdrop = {
        airdropId: airdrop.id,
        airdropName: airdrop.name,
        airdropImage: airdrop.image || "",
      };

      if (docSnap.exists()) {
        await updateDoc(tgeRef, {
          airdrops: arrayUnion(newAirdrop),
        });
      } else {
        await setDoc(tgeRef, {
          airdrops: [newAirdrop],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error assigning airdrop to date:", error);
      throw new Error("Failed to assign airdrop to date");
    }
  }

  async removeAirdropFromDate(date: string, airdropId: string): Promise<void> {
    try {
      const tgeRef = doc(db, "tge_assignments", date);
      const docSnap = await getDoc(tgeRef);

      if (docSnap.exists()) {
        const airdrops = docSnap.data().airdrops as TGEAirdrop[];
        const airdropToRemove = airdrops.find((a) => a.airdropId === airdropId);

        if (airdropToRemove) {
          await updateDoc(tgeRef, {
            airdrops: arrayRemove(airdropToRemove),
          });
        }
      }
    } catch (error) {
      console.error("Error removing airdrop from date:", error);
      throw new Error("Failed to remove airdrop from date");
    }
  }

  async getAirdropsForDate(date: string): Promise<TGEAirdrop[] | null> {
    try {
      const tgeRef = doc(db, "tge_assignments", date);
      const docSnap = await getDoc(tgeRef);

      if (docSnap.exists()) {
        return (docSnap.data().airdrops as TGEAirdrop[]) || [];
      }

      return [];
    } catch (error) {
      console.error("Error fetching airdrops for date:", error);

      return [];
    }
  }
}

export const tgeService = new TGEService();
