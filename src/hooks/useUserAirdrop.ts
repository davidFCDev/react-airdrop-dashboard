import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { useUserAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { airdropService } from "@/service/airdrop.service";
import { useAirdropStore } from "@/store/airdropStore";
import { Airdrop, Note, UserAirdropData } from "@/types";

export const useUserAirdrop = (airdropId: string) => {
  const { user } = useUserAuth();
  const { userAirdropData: storeUserAirdropData } = useAirdropStore();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
  const [localUserAirdropData, setLocalUserAirdropData] =
    useState<UserAirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Usar datos del store si están disponibles, sino del estado local
  const userAirdropData =
    localUserAirdropData || storeUserAirdropData.get(airdropId) || null;

  useEffect(() => {
    if (!airdropId) {
      setError("Invalid airdrop ID");
      setLoading(false);

      return;
    }

    const fetchAirdrop = async () => {
      try {
        const airdropData = await airdropService.getAirdrop(airdropId);

        if (!airdropData) {
          setError("Airdrop not found");
          setLoading(false);

          return;
        }
        setAirdrop(airdropData);
      } catch (err) {
        setError(
          `Error fetching airdrop: ${err instanceof Error ? err.message : "Unknown"}`,
        );
      }
    };

    fetchAirdrop();

    if (!user?.uid) {
      setLocalUserAirdropData(null);
      setLoading(false);

      return;
    }

    const userAirdropRef = doc(
      db,
      "user_airdrops",
      user.uid,
      "airdrops",
      airdropId,
    );
    const unsubscribe = onSnapshot(
      userAirdropRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setLocalUserAirdropData(docSnap.data() as UserAirdropData);
        } else {
          airdropService.initializeUserAirdrop(airdropId).then(() => {
            setLocalUserAirdropData({
              favorite: false,
              daily_tasks: [],
              general_tasks: [],
              notes: [],
              invested: 0,
              received: 0,
            });
          });
        }
        setLoading(false);
      },
      (err) => {
        setError(`Error fetching user airdrop data: ${err.message}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [airdropId, user]);

  const completedTasks = useMemo(() => {
    const tasks = new Set<string>();

    userAirdropData?.daily_tasks.forEach((task, index) => {
      if (task.completed) tasks.add(`daily_${index}`);
    });
    userAirdropData?.general_tasks.forEach((task, index) => {
      if (task.completed) tasks.add(`general_${index}`);
    });

    return tasks;
  }, [userAirdropData]);

  const progress = useMemo(
    () =>
      airdrop && userAirdropData
        ? Math.round(
            (completedTasks.size /
              (airdrop.user.daily_tasks.length +
                airdrop.user.general_tasks.length)) *
              100,
          )
        : 0,
    [airdrop, userAirdropData, completedTasks],
  );

  const toggleTask = async (type: "daily" | "general", index: number) => {
    if (!userAirdropData || !airdrop || !user?.uid || isUpdating) return;

    setIsUpdating(true);

    // Actualización optimista
    const tasks =
      type === "daily"
        ? userAirdropData.daily_tasks
        : userAirdropData.general_tasks;
    const newTasks = [...tasks];

    newTasks[index] = {
      ...newTasks[index],
      completed: !newTasks[index].completed,
    };

    const updatedData = {
      ...userAirdropData,
      [`${type}_tasks`]: newTasks,
      favorite: true,
    };

    setLocalUserAirdropData(updatedData);

    try {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, {
        [`${type}_tasks`]: newTasks,
        favorite: true,
      });
    } catch (err) {
      setError(
        `Error updating task: ${err instanceof Error ? err.message : "Unknown"}`,
      );
      // Revertir si falla
      setLocalUserAirdropData(userAirdropData);
    } finally {
      setIsUpdating(false);
    }
  };

  const addNote = async (text: string) => {
    if (!userAirdropData || !user?.uid || isUpdating) return;

    setIsUpdating(true);

    const newNote: Note = {
      id: new Date().toISOString(),
      text,
      created_at: new Date().toISOString(),
    };
    const newNotes = [...userAirdropData.notes, newNote];

    setLocalUserAirdropData({ ...userAirdropData, notes: newNotes });

    try {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, { notes: newNotes });
    } catch (err) {
      setError(
        `Error adding note: ${err instanceof Error ? err.message : "Unknown"}`,
      );
      setLocalUserAirdropData(userAirdropData);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeNote = async (noteId: string) => {
    if (!userAirdropData || !user?.uid || isUpdating) return;

    setIsUpdating(true);

    const newNotes = userAirdropData.notes.filter((note) => note.id !== noteId);

    setLocalUserAirdropData({ ...userAirdropData, notes: newNotes });

    try {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, { notes: newNotes });
    } catch (err) {
      setError(
        `Error removing note: ${err instanceof Error ? err.message : "Unknown"}`,
      );
      setLocalUserAirdropData(userAirdropData);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateInvestment = async (invested: number, received: number) => {
    if (!userAirdropData || !user?.uid || isUpdating) return;

    setIsUpdating(true);

    setLocalUserAirdropData({ ...userAirdropData, invested, received });

    try {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      await updateDoc(userAirdropRef, { invested, received });
    } catch (err) {
      setError(
        `Error updating investment: ${err instanceof Error ? err.message : "Unknown"}`,
      );
      setLocalUserAirdropData(userAirdropData);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    airdrop,
    userAirdropData,
    completedTasks,
    notes: userAirdropData?.notes || [],
    progress,
    loading,
    error,
    toggleTask,
    addNote,
    removeNote,
    updateInvestment,
    isUpdating,
  };
};
