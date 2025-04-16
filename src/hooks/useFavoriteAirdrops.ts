import { useAirdropStore } from "@/store/airdropStore";

export const useFavoriteAirdrops = () => {
  const { favorites, loading, updatingFavorites, error, toggleFavorite } =
    useAirdropStore();

  return {
    favorites,
    loading,
    updating: updatingFavorites,
    error,
    toggleFavorite,
  };
};
