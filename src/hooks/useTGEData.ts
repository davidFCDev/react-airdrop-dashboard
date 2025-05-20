/* eslint-disable no-console */
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useUserAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useAirdropStore } from "@/store/airdropStore";
import { Airdrop } from "@/types";

interface TGEAssignment {
  airdropId: string;
  airdropName: string;
  airdropImage: string;
}

interface TGEData {
  tgeAssignments: Map<string, TGEAssignment[]>;
  airdrops: Airdrop[];
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  assignTGE: (date: string, airdrop: Airdrop) => Promise<void>;
  removeTGE: (date: string, airdropId: string) => Promise<void>;
}

export const useTGEData = (year: number, month: number): TGEData => {
  const { user } = useUserAuth();
  const {
    airdrops,
    tgeAssignments,
    loading,
    error,
    fetchTGEAssignments,
    assignTGE,
    removeTGE,
  } = useAirdropStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setIsAdmin(false);

      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();

        setIsAdmin(userData.role === "admin");
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribe = fetchTGEAssignments(year, month);

    return () => unsubscribe();
  }, [year, month, fetchTGEAssignments]);

  return {
    tgeAssignments,
    airdrops,
    isAdmin,
    loading,
    error,
    assignTGE,
    removeTGE,
  };
};
