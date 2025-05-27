import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
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
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AirdropDailyTasks from "./airdropDetails/AirdropDailyTasks";
import AirdropGeneralTasks from "./airdropDetails/AirdropGeneralTasks";
import AirdropLinks from "./airdropDetails/AirdropLinks";

import {
  ChevronDownIcon,
  DeleteIcon,
  DiscordIcon,
  EditIcon,
  RightArrowIcon,
  SearchIcon,
  StarFilledIcon,
  StarIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  columns,
  confirmationColorMap,
  costColorMap,
  stageColorMap,
  statusColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";
import { useUserAuth } from "@/context/AuthContext";
import { useAirdropTable } from "@/hooks/useAirdropTable";
import { useUserAirdrop } from "@/hooks/useUserAirdrop";
import { useAirdropStore } from "@/store/airdropStore";
import { Airdrop } from "@/types";

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
    toggleTracked,
    showTracked,
    selectedAirdrop,
    setSelectedAirdrop,
    onRowSelect,
  } = useAirdropTable();
  const {
    trackedAirdrops,
    updatingFavorites,
    toggleTracking,
    userAirdropData,
  } = useAirdropStore();
  const { toggleTask, isUpdating } = useUserAirdrop(selectedAirdrop?.id || "");

  const filteredHeaderColumns =
    role === "admin"
      ? headerColumns
      : headerColumns.filter((column) => column.uid !== "actions");

  const renderCell = (
    airdrop: Airdrop,
    columnKey: keyof Airdrop | "links" | "tags" | "tracking" | "actions",
  ): React.ReactNode => {
    if (["links", "tags", "tracking", "actions"].includes(columnKey)) {
      switch (columnKey) {
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
        case "tracking":
          const isTracked = trackedAirdrops.has(airdrop.id);

          return (
            <Button
              isIconOnly
              aria-label={
                isTracked
                  ? t("airdrop.remove_tracking")
                  : t("airdrop.add_tracking")
              }
              isDisabled={updatingFavorites.has(airdrop.id)}
              variant="light"
              onPress={() => toggleTracking(airdrop.id, !isTracked)}
            >
              {isTracked ? (
                <StarFilledIcon className="w-5 h-5" />
              ) : (
                <StarIcon className="w-5 h-5" />
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
      }
    }

    const cellValue = airdrop[columnKey as keyof Airdrop];

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
      case "confirmation":
        return (
          <Chip
            className="capitalize"
            color={confirmationColorMap[airdrop.confirmation]}
            size="sm"
            variant="flat"
          >
            {airdrop.confirmation}
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
            {`Tier ${airdrop.tier}`}
          </Chip>
        );
      case "funding":
        return cellValue ? `$ ${cellValue}` : "Unknown";
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
      case "created_at":
      case "last_edited":
        return new Date(cellValue as string).toLocaleDateString();
      default:
        return String(cellValue);
    }
  };

  const topContent = (
    <div className="flex gap-2 items-center justify-center">
      <Input
        isClearable
        className="w-64"
        placeholder={t("airdrop.search_placeholder")}
        startContent={<SearchIcon />}
        value={filterValue}
        variant="bordered"
        onClear={onClear}
        onValueChange={onSearchChange}
      />
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="bg-default-50 border border-default-300 text-default-900 hover:bg-default-100"
            endContent={<ChevronDownIcon className="text-small" />}
            variant="solid"
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
        color={showTracked ? "primary" : "default"}
        variant={showTracked ? "solid" : "bordered"}
        onPress={toggleTracked}
      >
        {t("airdrop.show_tracked")}
      </Button>
    </div>
  );

  const completedTasks = useMemo(() => {
    if (!selectedAirdrop) return new Set<string>();

    const tasks = new Set<string>();
    const userData = userAirdropData.get(selectedAirdrop.id);

    userData?.daily_tasks?.forEach((task, index) => {
      if (task.completed) tasks.add(`daily_${index}`);
    });
    userData?.general_tasks?.forEach((task, index) => {
      if (task.completed) tasks.add(`general_${index}`);
    });

    return tasks;
  }, [selectedAirdrop, userAirdropData]);

  const handleTaskToggle = (task: string) => {
    if (!selectedAirdrop) return;

    const [type, index] = task.split("_");

    toggleTask(type as "daily" | "general", parseInt(index));
  };

  const getTaskText = (task: { en: string; es: string }) =>
    i18n.language === "es" ? task.es : task.en;

  return (
    <>
      <Table
        key={`${i18n.language}-${trackedAirdrops.size}`}
        isCompact
        removeWrapper
        aria-label={t("airdrop.table_label")}
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={{
          wrapper: "max-h-[600px] overflow-auto",
          th: "border-b border-default-200 bg-default-100",
          tbody: "bg-default-50",
          table: "bg-default-50 border border-default-200",
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
            <TableRow key={item.id} onClick={() => onRowSelect(item)}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(
                    item,
                    columnKey as
                      | keyof Airdrop
                      | "links"
                      | "tags"
                      | "tracking"
                      | "actions",
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedAirdrop && (
        <Drawer
          aria-label={t("airdrop.summary_drawer", {
            name: selectedAirdrop.name,
          })}
          className="bg-default-50 border-l border-default-200"
          isOpen={!!selectedAirdrop}
          placement="right"
          radius="none"
          size="lg"
          onOpenChange={(isOpen) => !isOpen && setSelectedAirdrop(null)}
        >
          <DrawerContent>
            <DrawerHeader className="border-b border-default-200">
              <h2 className="text-2xl font-bold">{selectedAirdrop.name}</h2>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-4 p-6">
              <img
                alt={selectedAirdrop.name}
                className="w-full h-40 object-cover rounded-md"
                src={selectedAirdrop.backdrop}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {renderCell(selectedAirdrop, "status")}
                  {renderCell(selectedAirdrop, "confirmation")}
                  {renderCell(selectedAirdrop, "tier")}
                  {renderCell(selectedAirdrop, "cost")}
                  {renderCell(selectedAirdrop, "chain")}
                </div>
                <div className="flex gap-2">
                  {selectedAirdrop.url && (
                    <Link
                      isExternal
                      color="foreground"
                      href={selectedAirdrop.url}
                      title="Website"
                    >
                      <WebsiteIcon className="w-4 h-4" />
                    </Link>
                  )}
                  {selectedAirdrop.discord && (
                    <Link
                      isExternal
                      color="foreground"
                      href={selectedAirdrop.discord}
                      title="Discord"
                    >
                      <DiscordIcon className="w-4 h-4" />
                    </Link>
                  )}
                  {selectedAirdrop.twitter && (
                    <Link
                      isExternal
                      color="foreground"
                      href={selectedAirdrop.twitter}
                      title="Twitter"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </Link>
                  )}
                  {selectedAirdrop.telegram && (
                    <Link
                      isExternal
                      color="foreground"
                      href={selectedAirdrop.telegram}
                      title="Telegram"
                    >
                      <TelegramIcon className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
              <AirdropDailyTasks
                isDrawer
                airdrop={selectedAirdrop}
                completedTasks={completedTasks}
                getTaskText={getTaskText}
                handleTaskToggle={handleTaskToggle}
                isUpdating={isUpdating}
              />
              <AirdropGeneralTasks
                isDrawer
                airdrop={selectedAirdrop}
                completedTasks={completedTasks}
                getTaskText={getTaskText}
                handleTaskToggle={handleTaskToggle}
                isUpdating={isUpdating}
              />
              <AirdropLinks isDrawer airdrop={selectedAirdrop} />
            </DrawerBody>
            <DrawerFooter className="border-t border-default-200 flex items-center justify-start">
              <Button
                aria-label={t("airdrop.check_more")}
                className="underline text-base"
                variant="light"
                onPress={() =>
                  navigate(`/airdrops/${selectedAirdrop.id}`, {
                    state: { airdrop: selectedAirdrop },
                  })
                }
              >
                <RightArrowIcon className="w-4 h-4 mr-2 text-primary" />
                {t("airdrop.check_more")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default AirdropTable;
