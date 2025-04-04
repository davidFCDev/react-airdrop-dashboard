import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

// Tipo de rol del usuario
export type Role = "admin" | "user";

export class AuthService {
  // Método para registrar un nuevo usuario
  async register(
    email: string,
    password: string,
    role: Role = "user", // Por defecto es usuario normal
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Crear documento del usuario en Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role,
      createdAt: new Date(),
    });

    return user;
  }

  // Método para iniciar sesión
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await signOut(auth);
  }

  // Método para obtener los datos del usuario actual (de Firebase Auth + Firestore)
  getCurrentUser(): Promise<{ user: User; role: Role } | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();

        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const data = userDoc.data();

            if (!data) {
              return resolve(null);
            }

            resolve({
              user,
              role: data.role as Role,
            });
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

export const authService = new AuthService(); // Instancia única para usar en la app
