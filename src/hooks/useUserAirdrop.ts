import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Airdrop } from "@/constants/airdrop.table";
import { useUserAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { airdropService } from "@/service/airdrop.service";

interface TaskStatus {
  id: string;
  completed: boolean;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
}

interface UserAirdropData {
  favorite: boolean;
  daily_tasks: TaskStatus[];
  general_tasks: TaskStatus[];
  notes: Note[];
  invested: number;
  received: number;
}

export const useUserAirdrop = (airdropId: string) => {
  const { user } = useUserAuth();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
  const [userAirdropData, setUserAirdropData] =
    useState<UserAirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setUserAirdropData(null);
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
          setUserAirdropData(docSnap.data() as UserAirdropData);
        } else {
          airdropService.initializeUserAirdrop(airdropId).then(() => {
            setUserAirdropData({
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

  const completedTasks = new Set<string>();

  userAirdropData?.daily_tasks.forEach((task, index) => {
    if (task.completed) completedTasks.add(`daily_${index}`);
  });
  userAirdropData?.general_tasks.forEach((task, index) => {
    if (task.completed) completedTasks.add(`general_${index}`);
  });

  const progress =
    airdrop && userAirdropData
      ? Math.round(
          (completedTasks.size /
            (airdrop.user.daily_tasks.length +
              airdrop.user.general_tasks.length)) *
            100,
        )
      : 0;

  const toggleTask = async (type: "daily" | "general", index: number) => {
    if (!userAirdropData || !airdrop || !user?.uid) return;

    const tasks =
      type === "daily"
        ? userAirdropData.daily_tasks
        : userAirdropData.general_tasks;
    const newTasks = [...tasks];

    newTasks[index] = {
      ...newTasks[index],
      completed: !newTasks[index].completed,
    };

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
    }
  };

  const addNote = async (content: string) => {
    if (!userAirdropData || !user?.uid) return;

    const newNote: Note = {
      id: new Date().toISOString(),
      content,
      created_at: new Date().toISOString(),
    };
    const newNotes = [...userAirdropData.notes, newNote];

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
    }
  };

  const removeNote = async (noteId: string) => {
    if (!userAirdropData || !user?.uid) return;

    const newNotes = userAirdropData.notes.filter((note) => note.id !== noteId);

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
    }
  };

  const updateInvestment = async (invested: number, received: number) => {
    if (!userAirdropData || !user?.uid) return;

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
  };
};
