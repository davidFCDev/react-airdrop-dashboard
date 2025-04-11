import { SortDescriptor } from "@heroui/table";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Airdrop, AIRDROP_LIST, columns } from "@/constants/airdrop.table";

export const useAirdropTable = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(columns.map((c) => c.uid)),
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const airdrops = React.useMemo(
    () =>
      AIRDROP_LIST.map((airdrop) => ({
        ...airdrop,
        created_at: new Date(airdrop.created_at).toISOString(),
        last_edited: new Date(airdrop.last_edited).toISOString(),
      })),
    [],
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(
    () => columns.filter((column) => visibleColumns.has(column.uid)),
    [visibleColumns],
  );

  const filteredItems = React.useMemo(() => {
    let filteredAirdrops = [...airdrops];

    if (hasSearchFilter) {
      filteredAirdrops = filteredAirdrops.filter((airdrop) =>
        airdrop.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredAirdrops;
  }, [airdrops, filterValue]);

  const sortedItems = React.useMemo(() => {
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

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = React.useCallback(() => {
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
  };
};
