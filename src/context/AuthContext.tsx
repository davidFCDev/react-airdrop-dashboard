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
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role as Role;

        return userRole === "admin" || userRole === "user" ? userRole : "user";
      }

      return "user";
    } catch {
      setError("No se pudo obtener el rol del usuario");

      return "user";
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser);
            const fetchedRole = await fetchUserRole(firebaseUser.uid);

            setRole(fetchedRole);
          } else {
            setUser(null);
            setRole(null);
          }
        } catch {
          setError("No se pudo autenticar");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Error de autenticación");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [fetchUserRole]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
    } catch {
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
