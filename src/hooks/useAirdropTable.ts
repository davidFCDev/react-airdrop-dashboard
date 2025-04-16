import { SortDescriptor } from "@heroui/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Airdrop, columns } from "@/constants/airdrop.table";
import { useUserAuth } from "@/context/AuthContext";
import { useAirdropStore } from "@/store/airdropStore";

export const useAirdropTable = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { airdrops, favorites, loading, error } = useAirdropStore();
  const [filterValue, setFilterValue] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.uid)),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  // Cargar airdrops y favoritos al montar el componente
  useEffect(() => {
    const unsubscribeAirdrops = useAirdropStore.getState().fetchAirdrops();
    let unsubscribeFavorites: (() => void) | undefined;

    if (user?.uid) {
      unsubscribeFavorites = useAirdropStore
        .getState()
        .fetchFavorites(user.uid);
    }

    return () => {
      unsubscribeAirdrops();
      if (unsubscribeFavorites) unsubscribeFavorites();
    };
  }, [user]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(
    () => columns.filter((column) => visibleColumns.has(column.uid)),
    [visibleColumns],
  );

  const filteredItems = useMemo(() => {
    let filteredAirdrops = [...airdrops];

    if (hasSearchFilter) {
      filteredAirdrops = filteredAirdrops.filter((airdrop) =>
        airdrop.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (showFavorites) {
      filteredAirdrops = filteredAirdrops.filter((airdrop) =>
        favorites.has(airdrop.id),
      );
    }

    return filteredAirdrops;
  }, [airdrops, filterValue, showFavorites, favorites]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Airdrop, b: Airdrop) => {
      const first = a[sortDescriptor.column as keyof Airdrop];
      const second = b[sortDescriptor.column as keyof Airdrop];
      const cmp =
        typeof first === "string" && typeof second === "string"
          ? first.localeCompare(second)
          : first < second
            ? -1
            : first > second
              ? 1
              : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const toggleFavorites = useCallback(() => {
    setShowFavorites((prev) => !prev);
  }, []);

  const handleRowClick = (airdrop: Airdrop) => {
    navigate(`/airdrops/${airdrop.id}`, { state: { airdrop } });
  };

  return {
    sortedItems,
    headerColumns,
    sortDescriptor,
    setSortDescriptor,
    filterValue,
    onSearchChange,
    onClear,
    visibleColumns,
    setVisibleColumns,
    toggleFavorites,
    showFavorites,
    handleRowClick,
    loading,
    error,
  };
};
