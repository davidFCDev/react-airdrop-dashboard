/* eslint-disable no-console */
import React from "react";
import { useParams } from "react-router-dom";

import { Airdrop } from "@/constants/airdrop.table";
import { airdropService } from "@/service/airdrop.service";

export const useAirdropDetails = () => {
  const { id } = useParams();
  const [airdrop, setAirdrop] = React.useState<Airdrop | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(
    new Set(),
  );
  const [notes, setNotes] = React.useState<string[]>([]);
  const [newNote, setNewNote] = React.useState<string>("");

  React.useEffect(() => {
    const fetchAirdrop = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        const foundAirdrop = await airdropService.getAirdrop(id);

        if (foundAirdrop) {
          setAirdrop(foundAirdrop);
          setNotes(foundAirdrop.user?.notes.map((note) => note.text) || []);
        }
      } catch (error) {
        console.error("Error fetching airdrop:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAirdrop();
  }, [id]);

  const totalTasks = airdrop
    ? airdrop.user.daily_tasks.length + airdrop.user.general_tasks.length
    : 0;
  const progress =
    totalTasks > 0 ? (completedTasks.size / totalTasks) * 100 : 0;

  const handleTaskToggle = (task: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(task)) {
        newSet.delete(task);
      } else {
        newSet.add(task);
      }

      return newSet;
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes((prev) => [...prev, newNote.trim()]);
      setNewNote("");
    }
  };

  return {
    airdrop,
    isLoading,
    completedTasks,
    handleTaskToggle,
    notes,
    newNote,
    setNewNote,
    handleAddNote,
    progress,
  };
};
