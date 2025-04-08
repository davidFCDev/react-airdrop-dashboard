import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  ChevronDownIcon,
  DiscordIcon,
  SearchIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/components/icons";
import {
  Airdrop,
  AIRDROP_TEST,
  AIRDROP_TEST2,
  columns,
  costColorMap,
  stageColorMap,
  statusColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";

const AirdropTable = () => {
  const { t, i18n } = useTranslation();
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(columns.map((c) => c.uid)),
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  // Forzamos un re-renderizado completo cuando cambie el idioma
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const airdrops: Airdrop[] = [AIRDROP_TEST, AIRDROP_TEST2];
  const hasSearchFilter = Boolean(filterValue);

  // Escuchar cambios de idioma y forzar actualización
  React.useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Idioma cambiado a:", i18n.language);
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAirdrops = [...airdrops];

    if (hasSearchFilter) {
      filteredAirdrops = filteredAirdrops.filter((airdrop) =>
        airdrop.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredAirdrops;
  }, [filterValue]);

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
  }, [sortDescriptor, filteredItems]);

  const renderCell = React.useCallback(
    (airdrop: Airdrop, columnKey: keyof Airdrop | "links" | "tags") => {
      const cellValue =
        columnKey === "links" || columnKey === "tags"
          ? undefined
          : airdrop[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-2">
              <img
                alt={airdrop.name}
                className="w-8 h-8 rounded-full"
                src={airdrop.image}
              />
              <span>{airdrop.name}</span>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[airdrop.status]}
              size="sm"
              variant="flat"
            >
              {airdrop.status}
            </Chip>
          );
        case "tier":
          return (
            <Chip
              className="capitalize"
              color={tierColorMap[airdrop.tier]}
              size="sm"
              variant="flat"
            >
              {airdrop.tier}
            </Chip>
          );
        case "funding":
          return `$${airdrop.funding}`;
        case "type":
          return (
            <Chip
              className="capitalize"
              color={typeColorMap[airdrop.type]}
              size="sm"
              variant="flat"
            >
              {airdrop.type}
            </Chip>
          );
        case "cost":
          return (
            <Chip
              className="capitalize"
              color={costColorMap[airdrop.cost]}
              size="sm"
              variant="flat"
            >
              {airdrop.cost}
            </Chip>
          );
        case "stage":
          return (
            <Chip
              className="capitalize"
              color={stageColorMap[airdrop.stage]}
              size="sm"
              variant="flat"
            >
              {airdrop.stage}
            </Chip>
          );
        case "chain":
          return (
            <Chip
              className="capitalize"
              color="default"
              size="sm"
              variant="flat"
            >
              {airdrop.chain}
            </Chip>
          );
        case "tags":
          return (
            <div className="flex gap-1 flex-wrap">
              {airdrop.tags.map((tag, index) => (
                <Chip key={index} color="default" size="sm" variant="flat">
                  {tag}
                </Chip>
              ))}
            </div>
          );
        case "links":
          return (
            <div className="flex gap-2">
              <Link isExternal href={airdrop.url} title="Website">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </Link>
              <Link isExternal href={airdrop.discord} title="Discord">
                <DiscordIcon className="w-4 h-4" />
              </Link>
              <Link isExternal href={airdrop.twitter} title="Twitter">
                <TwitterIcon className="w-4 h-4" />
              </Link>
              <Link isExternal href={airdrop.telegram} title="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </Link>
            </div>
          );
        case "created_at":
        case "last_edited":
          return new Date(airdrop[columnKey]).toLocaleDateString();
        default:
          return cellValue as string | number;
      }
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          className="w-64"
          placeholder={t("airdrop.searchPlaceholder")}
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              {t("airdrop.columns")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(keys) =>
              setVisibleColumns(new Set(keys as Iterable<string>))
            }
          >
            {columns.map((column) => (
              <DropdownItem key={String(column.uid)} className="capitalize">
                {t(`airdrop.${column.uid}`)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, t, i18n.language]);

  return (
    <Table
      aria-label="Airdrops Table"
      classNames={{
        wrapper: "max-h-[600px] overflow-auto",
        td: "border-b border-default-200",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={String(column.uid)}
            align={column.uid === "links" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {t(`airdrop.${column.uid}`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={t("airdrop.noAirdrops")} items={sortedItems}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey as keyof Airdrop | "links" | "tags",
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AirdropTable;
