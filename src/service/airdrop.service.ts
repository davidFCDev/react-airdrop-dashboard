import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { Airdrop } from "@/constants/airdrop.table";
import { auth, db } from "@/lib/firebase";

class AirdropService {
  private collectionName = "airdrops";

  async createAirdrop(airdrop: Omit<Airdrop, "id">): Promise<string> {
    try {
      if (!airdrop.name?.trim()) {
        throw new Error("El nombre del airdrop es requerido");
      }

      const airdropWithId = {
        ...airdrop,
        id: "",
        created_at: airdrop.created_at || new Date().toISOString(),
        last_edited: airdrop.last_edited || new Date().toISOString(),
        user: {
          ...airdrop.user,
          uid: auth.currentUser?.uid || "",
          daily_tasks: airdrop.user?.daily_tasks || [],
          general_tasks: airdrop.user?.general_tasks || [],
          notes: airdrop.user?.notes || [],
        },
      };

      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const newDocRef = doc(collection(db, this.collectionName));

      airdropWithId.id = newDocRef.id;

      await setDoc(newDocRef, airdropWithId);

      return newDocRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getAirdrop(id: string): Promise<Airdrop | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as Airdrop;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async getAllAirdrops(): Promise<Airdrop[]> {
    try {
      const q = query(collection(db, this.collectionName));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => doc.data() as Airdrop);
    } catch (error) {
      throw error;
    }
  }

  async updateAirdrop(id: string, airdrop: Partial<Airdrop>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      await updateDoc(docRef, airdrop);
    } catch (error) {
      throw error;
    }
  }

  async deleteAirdrop(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
}

export const airdropService = new AirdropService();
