import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { Airdrop } from "@/types";

interface UserAirdropData {
  favorite: boolean;
  daily_tasks: { id: string; completed: boolean }[];
  general_tasks: { id: string; completed: boolean }[];
  notes: { id: string; text: string; created_at: string }[];
}

class AirdropService {
  private collectionName = "airdrops";
  private userCollectionName = "user_airdrops";

  async createAirdrop(airdrop: Omit<Airdrop, "id">): Promise<string> {
    try {
      if (!airdrop.name?.trim()) {
        throw new Error("El nombre del airdrop es requerido");
      }
      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        throw new Error("Acceso denegado: Solo administradores");
      }

      const airdropWithId = {
        ...airdrop,
        id: "",
        created_at: airdrop.created_at || new Date().toISOString(),
        last_edited: airdrop.last_edited || new Date().toISOString(),
        user: {
          ...airdrop.user,
          uid: auth.currentUser.uid,
          daily_tasks: airdrop.user?.daily_tasks || [],
          general_tasks: airdrop.user?.general_tasks || [],
          notes: airdrop.user?.notes || [],
        },
      };

      const newDocRef = doc(collection(db, this.collectionName));

      airdropWithId.id = newDocRef.id;

      await setDoc(newDocRef, airdropWithId);

      return newDocRef.id;
    } catch (error) {
      throw new Error(
        `Error al crear airdrop: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async getAirdrop(id: string): Promise<Airdrop | null> {
    try {
      if (!id) throw new Error("ID del airdrop no proporcionado");
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? (docSnap.data() as Airdrop) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener airdrop: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async getAllAirdrops(): Promise<Airdrop[]> {
    try {
      const q = query(collection(db, this.collectionName));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => doc.data() as Airdrop);
    } catch (error) {
      throw new Error(
        `Error al obtener todos los airdrops: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async updateAirdrop(id: string, airdrop: Partial<Airdrop>): Promise<void> {
    try {
      if (!id) throw new Error("ID del airdrop no proporcionado");
      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        throw new Error("Acceso denegado: Solo administradores");
      }

      const docRef = doc(db, this.collectionName, id);

      await updateDoc(docRef, airdrop);
    } catch (error) {
      throw new Error(
        `Error al actualizar airdrop: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async deleteAirdrop(id: string): Promise<void> {
    try {
      if (!id) throw new Error("ID del airdrop no proporcionado");
      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        throw new Error("Acceso denegado: Solo administradores");
      }

      const docRef = doc(db, this.collectionName, id);

      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(
        `Error al eliminar airdrop: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async initializeUserAirdrop(airdropId: string): Promise<void> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const airdropDoc = await this.getAirdrop(airdropId);

      if (!airdropDoc) throw new Error("Airdrop no encontrado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );
      const userAirdropSnap = await getDoc(userAirdropRef);

      if (!userAirdropSnap.exists()) {
        const dailyTasks = airdropDoc.user.daily_tasks.map((_, index) => ({
          id: `daily_${index}`,
          completed: false,
        }));
        const generalTasks = airdropDoc.user.general_tasks.map((_, index) => ({
          id: `general_${index}`,
          completed: false,
        }));

        await setDoc(
          userAirdropRef,
          {
            favorite: false,
            daily_tasks: dailyTasks,
            general_tasks: generalTasks,
            notes: [],
          },
          { merge: true },
        );
      }
    } catch (error) {
      throw new Error(
        `Error al inicializar datos del usuario: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async getUserAirdropData(airdropId: string): Promise<UserAirdropData | null> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );
      const userAirdropSnap = await getDoc(userAirdropRef);

      return userAirdropSnap.exists()
        ? (userAirdropSnap.data() as UserAirdropData)
        : null;
    } catch (error) {
      throw new Error(
        `Error al obtener datos del usuario: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async toggleTaskCompletion(
    airdropId: string,
    taskType: "daily" | "general",
    taskId: string,
    completed: boolean,
  ): Promise<void> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );
      const userAirdropSnap = await getDoc(userAirdropRef);

      if (userAirdropSnap.exists()) {
        const tasks = userAirdropSnap.data()[`${taskType}_tasks`];
        const updatedTasks = tasks.map((task: any) =>
          task.id === taskId ? { ...task, completed } : task,
        );

        await updateDoc(userAirdropRef, {
          [`${taskType}_tasks`]: updatedTasks,
        });
      }
    } catch (error) {
      throw new Error(
        `Error al actualizar tarea: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async addNote(airdropId: string, text: string): Promise<void> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      if (!text.trim()) throw new Error("El texto de la nota es requerido");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, {
        notes: arrayUnion({
          id: `note_${Date.now()}`,
          text: text.trim(),
          created_at: new Date().toISOString(),
        }),
      });
    } catch (error) {
      throw new Error(
        `Error al añadir nota: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async removeNote(airdropId: string, noteId: string): Promise<void> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      if (!noteId) throw new Error("ID de la nota no proporcionado");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );
      const userAirdropSnap = await getDoc(userAirdropRef);

      if (userAirdropSnap.exists()) {
        const notes = userAirdropSnap.data().notes;
        const noteToRemove = notes.find((note: any) => note.id === noteId);

        if (noteToRemove) {
          await updateDoc(userAirdropRef, {
            notes: arrayRemove(noteToRemove),
          });
        }
      }
    } catch (error) {
      throw new Error(
        `Error al eliminar nota: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async toggleFavorite(airdropId: string, favorite: boolean): Promise<void> {
    try {
      if (!airdropId) throw new Error("ID del airdrop no proporcionado");
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropRef = doc(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, { favorite });
    } catch (error) {
      throw new Error(
        `Error al actualizar favoritos: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }

  async getFavoriteAirdrops(): Promise<Airdrop[]> {
    try {
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const userAirdropsRef = collection(
        db,
        this.userCollectionName,
        user.uid,
        "airdrops",
      );
      const q = query(userAirdropsRef, where("favorite", "==", true));
      const querySnapshot = await getDocs(q);

      const airdropIds = querySnapshot.docs.map((doc) => doc.id);
      const airdrops: Airdrop[] = [];

      for (const id of airdropIds) {
        const airdrop = await this.getAirdrop(id);

        if (airdrop) airdrops.push(airdrop);
      }

      return airdrops;
    } catch (error) {
      throw new Error(
        `Error al obtener favoritos: ${error instanceof Error ? error.message : "Desconocido"}`,
      );
    }
  }
}

export const airdropService = new AirdropService();
