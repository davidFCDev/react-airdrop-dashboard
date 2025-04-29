import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  avatar: string | null;
  role: string | null;
  createdAt: string;
  pinned: boolean;
}

export class ChatService {
  private readonly collectionName = "global_chat";

  async sendMessage(
    text: string,
    user: { uid: string; email: string | null } | null,
  ): Promise<void> {
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (!text.trim()) {
      throw new Error("Message cannot be empty");
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, this.collectionName), {
        text: text.trim(),
        userId: user.uid,
        userName: userData.nickname || user.email || "Anonymous",
        avatar: userData.avatar || null,
        role: userData.role || null,
        createdAt: new Date().toISOString(),
        pinned: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }

  subscribeToMessages(callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      collection(db, this.collectionName),
      orderBy("createdAt", "asc"), // Cambiado a asc para Discord-like
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatMessage[];

        callback(messages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
      },
    );

    return unsubscribe;
  }

  async deleteMessage(
    messageId: string,
    user: { uid: string; email: string | null } | null,
  ): Promise<void> {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      await deleteDoc(doc(db, this.collectionName, messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error("Failed to delete message");
    }
  }

  async updateMessage(
    messageId: string,
    text: string,
    user: { uid: string; email: string | null } | null,
  ): Promise<void> {
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (!text.trim()) {
      throw new Error("Message cannot be empty");
    }

    try {
      await updateDoc(doc(db, this.collectionName, messageId), {
        text: text.trim(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating message:", error);
      throw new Error("Failed to update message");
    }
  }

  async pinMessage(
    messageId: string,
    user: { uid: string; email: string | null } | null,
    pinned: boolean,
  ): Promise<void> {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    if (userData.role !== "admin") {
      throw new Error("Only admins can pin messages");
    }

    try {
      await updateDoc(doc(db, this.collectionName, messageId), {
        pinned,
      });
    } catch (error) {
      console.error("Error pinning message:", error);
      throw new Error("Failed to pin message");
    }
  }
}

export const chatService = new ChatService();
