import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useUserAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { airdropService } from "@/service/airdrop.service";

export const useFavoriteAirdrops = () => {
  const { user } = useUserAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      setError("Usuario no autenticado");
      setLoading(false);

      return;
    }

    const userAirdropsRef = collection(
      db,
      "user_airdrops",
      user.uid,
      "airdrops",
    );
    const q = query(userAirdropsRef, where("favorite", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const favoriteIds = new Set<string>(snapshot.docs.map((doc) => doc.id));

        setFavorites(favoriteIds);
        setError(null);
        setLoading(false);
      },
      (err) => {
        const errorMsg = `Error en snapshot de favoritos: ${err.message}`;

        setError(errorMsg);
        setFavorites(new Set());
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const toggleFavorite = useCallback(
    async (airdropId: string, favorite: boolean) => {
      if (!user || updating.has(airdropId) || !airdropId) {
        const errorMsg =
          "No se puede actualizar: usuario no autenticado o ID inválido";

        setError(errorMsg);

        return;
      }

      try {
        setUpdating((prev) => new Set(prev).add(airdropId));

        // Verificar que el airdrop existe
        const airdrop = await airdropService.getAirdrop(airdropId);

        if (!airdrop) {
          throw new Error("Airdrop no encontrado");
        }

        // Inicializar el documento si no existe
        await airdropService.initializeUserAirdrop(airdropId);

        // Actualizar el estado de favorito
        await airdropService.toggleFavorite(airdropId, favorite);

        // Actualización manual como respaldo
        setFavorites((prev) => {
          const newFavorites = new Set(prev);

          if (favorite) {
            newFavorites.add(airdropId);
          } else {
            newFavorites.delete(airdropId);
          }

          return newFavorites;
        });
      } catch (err) {
        const errorMsg = `Error al actualizar favorito: ${err instanceof Error ? err.message : "Desconocido"}`;

        setError(errorMsg);
      } finally {
        setUpdating((prev) => {
          const newUpdating = new Set(prev);

          newUpdating.delete(airdropId);

          return newUpdating;
        });
      }
    },
    [user],
  );

  return { favorites, loading, updating, error, toggleFavorite };
};
