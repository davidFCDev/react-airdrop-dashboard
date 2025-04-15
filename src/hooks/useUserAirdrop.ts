import { useCallback, useEffect, useState } from "react";

import { Airdrop } from "@/constants/airdrop.table";
import { useUserAuth } from "@/context/AuthContext";
import { airdropService } from "@/service/airdrop.service";

interface TaskStatus {
  id: string;
  completed: boolean;
}

interface Note {
  id: string;
  text: string;
  created_at: string;
}

interface UserAirdropData {
  favorite: boolean;
  daily_tasks: TaskStatus[];
  general_tasks: TaskStatus[];
  notes: Note[];
}

export const useUserAirdrop = (airdropId: string) => {
  const { user } = useUserAuth();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
  const [userAirdropData, setUserAirdropData] =
    useState<UserAirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!airdropId) {
      setError("ID del airdrop no proporcionado");
      setLoading(false);

      return;
    }

    if (!user) {
      setError("Usuario no autenticado");
      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      // Obtener datos del airdrop
      const airdropData = await airdropService.getAirdrop(airdropId);

      if (!airdropData) {
        setError("Airdrop no encontrado");
        setLoading(false);

        return;
      }
      setAirdrop(airdropData);

      // Intentar inicializar datos del usuario
      try {
        await airdropService.initializeUserAirdrop(airdropId);
      } catch (initError) {
        console.warn("No se pudo inicializar datos del usuario:", initError);
        // Continuar para obtener datos existentes
      }

      // Obtener datos del usuario
      const userData = await airdropService.getUserAirdropData(airdropId);

      setUserAirdropData(
        userData || {
          favorite: false,
          daily_tasks: [],
          general_tasks: [],
          notes: [],
        },
      );
    } catch (err) {
      setError(
        `Error al cargar datos: ${err instanceof Error ? err.message : "Desconocido"}`,
      );
    } finally {
      setLoading(false);
    }
  }, [user, airdropId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedTasks = new Set<string>([
    ...(userAirdropData?.daily_tasks.filter((t) => t.completed) || []).map(
      (t) => `daily_${t.id.split("_")[1]}`,
    ),
    ...(userAirdropData?.general_tasks.filter((t) => t.completed) || []).map(
      (t) => `general_${t.id.split("_")[1]}`,
    ),
  ]);

  const toggleTask = useCallback(
    async (taskType: "daily" | "general", taskIndex: number) => {
      if (!userAirdropData) return;
      const taskId = `${taskType}_${taskIndex}`;
      const tasks = userAirdropData[`${taskType}_tasks`];
      const task = tasks.find((t) => t.id === taskId);

      if (!task) return;

      try {
        const newCompleted = !task.completed;

        await airdropService.toggleTaskCompletion(
          airdropId,
          taskType,
          taskId,
          newCompleted,
        );
        setUserAirdropData((prev) =>
          prev
            ? {
                ...prev,
                [`${taskType}_tasks`]: prev[`${taskType}_tasks`].map((t) =>
                  t.id === taskId ? { ...t, completed: newCompleted } : t,
                ),
              }
            : prev,
        );
      } catch {
        setError("Error al actualizar tarea");
      }
    },
    [airdropId, userAirdropData],
  );

  const addNote = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      try {
        await airdropService.addNote(airdropId, text);
        setUserAirdropData((prev) =>
          prev
            ? {
                ...prev,
                notes: [
                  ...prev.notes,
                  {
                    id: `note_${Date.now()}`,
                    text,
                    created_at: new Date().toISOString(),
                  },
                ],
              }
            : prev,
        );
      } catch {
        setError("Error al añadir nota");
      }
    },
    [airdropId],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      try {
        await airdropService.removeNote(airdropId, noteId);
        setUserAirdropData((prev) =>
          prev
            ? {
                ...prev,
                notes: prev.notes.filter((note) => note.id !== noteId),
              }
            : prev,
        );
      } catch {
        setError("Error al eliminar nota");
      }
    },
    [airdropId],
  );

  const toggleFavorite = useCallback(
    async (favorite: boolean) => {
      try {
        await airdropService.toggleFavorite(airdropId, favorite);
        setUserAirdropData((prev) => (prev ? { ...prev, favorite } : prev));
      } catch {
        setError("Error al actualizar favoritos");
      }
    },
    [airdropId],
  );

  const progress =
    airdrop && userAirdropData
      ? Math.round(
          (completedTasks.size /
            (airdrop.user.daily_tasks.length +
              airdrop.user.general_tasks.length)) *
            100,
        ) || 0
      : 0;

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
    toggleFavorite,
  };
};
