import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { DownArrowIcon } from "./icons";

import { useInvestmentData } from "@/hooks/useInvestmentData";

const Investment = () => {
  const { t } = useTranslation();
  const {
    favoriteAirdrops,
    totalProfit,
    hasInvestments,
    profitImage,
    loading,
    error,
  } = useInvestmentData();

  // Manejo de errores
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">
            {t("favorites.error")}: {error}
          </p>
          <Button
            className="mt-4"
            color="primary"
            onPress={() => window.location.reload()}
          >
            {t("favorites.retry")}
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar spinner durante carga
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="mx-auto" size="lg" />
      </section>
    );
  }

  // Renderizado principal
  return (
    <section className="flex flex-col items-center justify-start w-full">
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
                th: "border-b border-default-200 bg-default-100 text-xl",
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
                  const profit = airdrop.received - airdrop.invested;
                  const roi =
                    airdrop.invested > 0
                      ? (profit / airdrop.invested) * 100
                      : 0;

                  return (
                    <TableRow key={airdrop.id}>
                      <TableCell className="text-lg">{airdrop.name}</TableCell>
                      <TableCell>{airdrop.invested.toFixed(2)} $</TableCell>
                      <TableCell>{airdrop.received.toFixed(2)} $</TableCell>
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
