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
import { db } from "@/lib/firebase";

class AirdropService {
  private collectionName = "airdrops";

  async createAirdrop(airdrop: Omit<Airdrop, "id">): Promise<string> {
    const newDocRef = doc(collection(db, this.collectionName));
    const airdropWithId = { ...airdrop, id: newDocRef.id };

    await setDoc(newDocRef, airdropWithId);

    return newDocRef.id;
  }

  async getAirdrop(id: string): Promise<Airdrop | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Airdrop;
    }

    return null;
  }

  async getAllAirdrops(): Promise<Airdrop[]> {
    const q = query(collection(db, this.collectionName));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Airdrop);
  }

  async updateAirdrop(id: string, airdrop: Partial<Airdrop>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);

    await updateDoc(docRef, airdrop);
  }

  async deleteAirdrop(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);

    await deleteDoc(docRef);
  }
}

export const airdropService = new AirdropService();
