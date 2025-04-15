/* eslint-disable no-console */
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth, db } from "@/lib/firebase";

type Role = "admin" | "user" | null;

interface AuthContextProps {
  user: User | null;
  role: Role;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async (uid: string): Promise<Role> => {
    try {
      console.log("AuthContext: Fetching role for uid", uid);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role as Role;

        console.log("AuthContext: Role fetched", userRole);

        return userRole === "admin" || userRole === "user" ? userRole : "user";
      }

      console.log("AuthContext: No user doc, defaulting to user");

      return "user";
    } catch (err) {
      console.error("AuthContext: Error fetching role", err);
      setError("No se pudo obtener el rol del usuario");

      return "user";
    }
  }, []);

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            console.log("AuthContext: User authenticated", firebaseUser.uid);
            setUser(firebaseUser);
            const fetchedRole = await fetchUserRole(firebaseUser.uid);

            setRole(fetchedRole);
          } else {
            console.log("AuthContext: No user authenticated");
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error("AuthContext: Auth error", err);
          setError("No se pudo autenticar");
        } finally {
          setLoading(false);
        }
      },
      () => {
        console.error("AuthContext: Auth state error");
        setError("Error de autenticación");
        setLoading(false);
      },
    );

    return () => {
      console.log("AuthContext: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [fetchUserRole]);

  const signOut = async () => {
    try {
      console.log("AuthContext: Signing out");
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error("AuthContext: Sign out error", err);
      setError("No se pudo cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext);
