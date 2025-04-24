import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { avatar1 } from "@/constants"; // Default avatar
import { auth, db } from "@/lib/firebase";

export type Role = "admin" | "user";

export class AuthService {
  async register(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user",
        createdAt: new Date(),
        avatar: avatar1, // Default avatar
        nickname: "", // Empty nickname
      });
    } catch (error) {
      console.error("Error saving on firestore:", error);
    }

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): Promise<{ user: User; role: Role } | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const data = userDoc.data();

            if (!data) {
              return resolve({ user, role: "user" });
            }
            resolve({ user, role: data.role as Role });
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
}

export const authService = new AuthService();
