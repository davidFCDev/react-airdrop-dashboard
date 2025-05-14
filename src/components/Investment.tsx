import { Button } from "@heroui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { DownArrowIcon } from "./icons";

import { useUserAuth } from "@/context/AuthContext";
import { useAirdropStore } from "@/store/airdropStore";

interface UserAirdropData {
  favorite: boolean;
  daily_tasks: { id: string; completed: boolean }[];
  general_tasks: { id: string; completed: boolean }[];
  notes: { id: string; content: string; created_at: string }[];
  invested: number;
  received: number;
}

const Investment = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const {
    airdrops,
    favorites,
    userAirdropData,
    loading: storeLoading,
    error: storeError,
  } = useAirdropStore();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || storeLoading) {
      setLocalLoading(true);

      return;
    }

    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);

    // Verificar si todos los favoriteAirdropIds tienen datos
    const allDataLoaded =
      favoriteAirdropIds.length === 0 ||
      favoriteAirdropIds.every((id) => userAirdropData.has(id));

    setLocalLoading(!allDataLoaded);

    // Timeout de respaldo
    const timeout = setTimeout(() => setLocalLoading(false), 5000);

    return () => clearTimeout(timeout);
  }, [user, airdrops, favorites, userAirdropData, storeLoading]);

  // Calcular favoriteAirdrops, totalProfit y totalInvested
  const favoriteAirdrops = useMemo(
    () => airdrops.filter((airdrop) => favorites.has(airdrop.id)),
    [airdrops, favorites],
  );

  const totalProfit = useMemo(() => {
    const profit = favoriteAirdrops.reduce((sum, airdrop) => {
      const data = userAirdropData.get(airdrop.id);

      if (!data) return sum;
      const invested =
        typeof data.invested === "number" && !isNaN(data.invested)
          ? data.invested
          : 0;
      const received =
        typeof data.received === "number" && !isNaN(data.received)
          ? data.received
          : 0;

      return sum + (received - invested);
    }, 0);

    return isNaN(profit) ? 0 : profit;
  }, [favoriteAirdrops, userAirdropData]);

  const totalInvested = useMemo(() => {
    const invested = favoriteAirdrops.reduce((sum, airdrop) => {
      const data = userAirdropData.get(airdrop.id);

      if (!data) return sum;
      const invested =
        typeof data.invested === "number" && !isNaN(data.invested)
          ? data.invested
          : 0;

      return sum + invested;
    }, 0);

    return isNaN(invested) ? 0 : invested;
  }, [favoriteAirdrops, userAirdropData]);

  // Verificar si hay airdrops con inversión
  const hasInvestments = useMemo(() => {
    const result = favoriteAirdrops.some((airdrop) => {
      const data = userAirdropData.get(airdrop.id);

      return (
        data &&
        typeof data.invested === "number" &&
        !isNaN(data.invested) &&
        data.invested > 0
      );
    });

    return result;
  }, [favoriteAirdrops, userAirdropData]);

  // Determinar la imagen según totalProfit y totalInvested
  const profitImage = useMemo(() => {
    if (totalProfit < 0) return "/images/bad.png";
    if (totalProfit <= 2 * totalInvested) return "/images/decent.png";

    return "/images/good.png";
  }, [totalProfit, totalInvested]);

  // Manejo de errores
  if (storeError) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-danger text-xl">
          {t("tracker.error")}: {storeError}
        </p>
      </section>
    );
  }

  // Mostrar spinner durante carga
  if (localLoading || storeLoading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // Renderizado principal
  return (
    <section className="flex flex-col items-center justify-center w-full">
      {!hasInvestments ? (
        <div className="text-neutral-100 text-xl font-light mt-8 flex flex-col items-center gap-4">
          {t("tracker.no_investments")}
          <Button as={Link} color="primary" to="/airdrops">
            {t("tracker.explore_airdrops")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {/* Columna izquierda: Tabla (2 columnas en lg) */}
          <div className="lg:col-span-2 w-full">
            <Table
              isCompact
              removeWrapper
              aria-label="Airdrop Tracker"
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
            >
              <TableHeader>
                <TableColumn>{t("tracker.airdrop")}</TableColumn>
                <TableColumn>{t("tracker.invested")}</TableColumn>
                <TableColumn>{t("tracker.received")}</TableColumn>
                <TableColumn>{t("tracker.profit")}</TableColumn>
                <TableColumn>{t("tracker.roi")}</TableColumn>
              </TableHeader>
              <TableBody>
                {favoriteAirdrops.map((airdrop) => {
                  const data = userAirdropData.get(airdrop.id);
                  const invested =
                    data &&
                    typeof data.invested === "number" &&
                    !isNaN(data.invested)
                      ? data.invested
                      : 0;
                  const received =
                    data &&
                    typeof data.received === "number" &&
                    !isNaN(data.received)
                      ? data.received
                      : 0;
                  const profit = received - invested;
                  const roi = invested > 0 ? (profit / invested) * 100 : 0;

                  return (
                    <TableRow key={airdrop.id}>
                      <TableCell className="text-lg">{airdrop.name}</TableCell>
                      <TableCell>{invested.toFixed(2)} $</TableCell>
                      <TableCell>{received.toFixed(2)} $</TableCell>
                      <TableCell
                        className={profit >= 0 ? "text-success" : "text-danger"}
                      >
                        {profit.toFixed(2)} $
                      </TableCell>
                      <TableCell
                        className={roi >= 0 ? "text-success" : "text-danger"}
                      >
                        {roi.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Columna derecha: Tarjeta de Profit/Loss (1 columna en lg) */}
          <div className="flex items-center justify-center lg:col-span-1">
            <div className="bg-default-100 border border-default-300 p-6 w-full max-w-xs flex flex-col items-center gap-4">
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-2xl text-neutral-100 font-bold flex items-center gap-2">
                  {t("tracker.total_profit")} <DownArrowIcon />
                </h3>
                <p
                  className={`text-4xl font-bold ${totalProfit >= 0 ? "text-success" : "text-danger"}`}
                >
                  {totalProfit.toFixed(2)} $
                </p>
              </div>
              <img
                alt="Profit status"
                className="w-72 object-contain"
                src={profitImage}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Investment;
