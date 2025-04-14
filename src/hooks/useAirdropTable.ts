import { SortDescriptor } from "@heroui/table";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Airdrop, columns } from "@/constants/airdrop.table";
import { db } from "@/lib/firebase";

export const useAirdropTable = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.uid)),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar airdrops desde Firestore
  useEffect(() => {
    const q = query(collection(db, "airdrops"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const airdropData: Airdrop[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at
            ? new Date(doc.data().created_at).toISOString()
            : new Date().toISOString(),
          last_edited: doc.data().last_edited
            ? new Date(doc.data().last_edited).toISOString()
            : new Date().toISOString(),
        })) as Airdrop[];

        setAirdrops(airdropData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching airdrops:", err);
        setError("Failed to load airdrops");
        setLoading(false);
      },
    );

    // Limpiar el listener al desmontar
    return () => unsubscribe();
  }, []);

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

    return filteredAirdrops;
  }, [airdrops, filterValue]);

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
    handleRowClick,
    loading,
    error,
  };
};
