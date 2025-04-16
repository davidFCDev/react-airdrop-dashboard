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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  ChevronDownIcon,
  DeleteIcon,
  DiscordIcon,
  EditIcon,
  HeartFilledIcon,
  HeartIcon,
  SearchIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  Airdrop,
  columns,
  costColorMap,
  stageColorMap,
  statusColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";
import { useUserAuth } from "@/context/AuthContext";
import { useAirdropTable } from "@/hooks/useAirdropTable";
import { useAirdropStore } from "@/store/airdropStore";

const AirdropTable = () => {
  const { t, i18n } = useTranslation();
  const { role } = useUserAuth();
  const navigate = useNavigate();
  const {
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
  } = useAirdropTable();
  const { favorites, updatingFavorites, toggleFavorite } = useAirdropStore();

  // Filtrar la columna "actions" si no es admin
  const filteredHeaderColumns =
    role === "admin"
      ? headerColumns
      : headerColumns.filter((column) => column.uid !== "actions");

  const renderCell = (
    airdrop: Airdrop,
    columnKey: keyof Airdrop | "links" | "tags" | "favorite" | "actions",
  ) => {
    const cellValue =
      columnKey === "links" ||
      columnKey === "tags" ||
      columnKey === "favorite" ||
      columnKey === "actions"
        ? undefined
        : airdrop[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <img
              alt={airdrop.name}
              className="w-8 h-8 rounded-full my-1"
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
        return `$ ${airdrop.funding}`;
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
          <Chip className="capitalize" color="default" size="sm" variant="flat">
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
            {airdrop.url && (
              <Link
                isExternal
                color="foreground"
                href={airdrop.url}
                title="Website"
              >
                <WebsiteIcon className="w-4 h-4" />
              </Link>
            )}
            {airdrop.discord && (
              <Link
                isExternal
                color="foreground"
                href={airdrop.discord}
                title="Discord"
              >
                <DiscordIcon className="w-4 h-4" />
              </Link>
            )}
            {airdrop.twitter && (
              <Link
                isExternal
                color="foreground"
                href={airdrop.twitter}
                title="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </Link>
            )}
            {airdrop.telegram && (
              <Link
                isExternal
                color="foreground"
                href={airdrop.telegram}
                title="Telegram"
              >
                <TelegramIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
        );
      case "favorite":
        const isFavorite = favorites.has(airdrop.id);

        return (
          <Button
            isIconOnly
            aria-label={
              isFavorite
                ? t("airdrop.remove_favorite")
                : t("airdrop.add_favorite")
            }
            isDisabled={updatingFavorites.has(airdrop.id)}
            variant="light"
            onPress={() => {
              toggleFavorite(airdrop.id, !isFavorite);
            }}
          >
            {isFavorite ? (
              <HeartFilledIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </Button>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              aria-label="Edit airdrop"
              variant="light"
              onPress={() =>
                navigate(`/edit/${airdrop.id}`, { state: { airdrop } })
              }
            >
              <EditIcon className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              aria-label="Delete airdrop"
              variant="light"
              onPress={() =>
                useAirdropStore.getState().deleteAirdrop(airdrop.id)
              }
            >
              <DeleteIcon className="w-5 h-5" />
            </Button>
          </div>
        );
      case "created_at":
      case "last_edited":
        return new Date(airdrop[columnKey]).toLocaleDateString();
      default:
        return cellValue as string | number;
    }
  };

  const topContent = (
    <div className="flex gap-2 items-center">
      <Input
        isClearable
        className="w-64"
        placeholder={t("airdrop.search_placeholder")}
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
            <DropdownItem key={column.uid} className="capitalize">
              {t(`airdrop.${column.uid}`)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Button
        color={showFavorites ? "primary" : "default"}
        variant="flat"
        onPress={toggleFavorites}
      >
        {showFavorites ? t("airdrop.show_all") : t("airdrop.show_favorites")}
      </Button>
    </div>
  );

  return (
    <Table
      key={`${i18n.language}-${favorites.size}`}
      isCompact
      removeWrapper
      aria-label="Airdrops Table"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={{
        wrapper: "max-h-[600px] overflow-auto",
        td: "border-b border-default-200",
        tr: "hover:bg-default-100 cursor-pointer transition-colors",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={filteredHeaderColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align="start"
            allowsSorting={column.sortable}
          >
            {t(`airdrop.${column.uid}`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={t("airdrop.no_airdrops")} items={sortedItems}>
        {(item) => (
          <TableRow
            key={item.id}
            onClick={() =>
              navigate(`/airdrops/${item.id}`, { state: { airdrop: item } })
            }
          >
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey as
                    | keyof Airdrop
                    | "links"
                    | "tags"
                    | "favorite"
                    | "actions",
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
