/* eslint-disable no-console */
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AirdropCard from "./AirdropCard";
import SectionHeader from "./ui/SectionHeader";

import { useUserAuth } from "@/context/AuthContext";
import { useFavoriteAirdropsData } from "@/hooks/useFavoriteAirdropsData";
import { useFavoriteAirdropSummaries } from "@/hooks/useFavoriteAirdropSummaries";
import { useAirdropStore } from "@/store/airdropStore";
import { FavoriteAirdrop, TaskStatus } from "@/types";

const WatchList: FC = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { favoriteAirdrops, loading, error } = useFavoriteAirdropsData();
  const { airdrops, favorites, userAirdropData } = useAirdropStore();
  const summary = useFavoriteAirdropSummaries();

  // Calcular tiempo restante hasta 00:00 UTC
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const nextReset = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
      );
      const diffMs = nextReset.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      setTimeUntilReset(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtrar favorites para incluir solo airdrops válidos
  const validFavorites = Array.from(favorites).filter((id) => {
    const airdropExists = airdrops.some((airdrop) => airdrop.id === id);
    const hasData = userAirdropData.has(id);

    return airdropExists && hasData;
  });
  const totalAirdrops = validFavorites.length;

  const dailyTasksPending =
    summary.totalDailyTasks - summary.completedDailyTasks;
  const generalTasksPending =
    summary.totalGeneralTasks - summary.completedGeneralTasks;
  const taskProgress =
    summary.totalTasks > 0
      ? ((summary.completedTasks / summary.totalTasks) * 100).toFixed(0)
      : "0";
  const totalInvested = validFavorites.reduce((sum, id) => {
    const data = userAirdropData.get(id);

    return sum + (data?.invested || 0);
  }, 0);
  const totalReceived = validFavorites.reduce((sum, id) => {
    const data = userAirdropData.get(id);

    return sum + (data?.received || 0);
  }, 0);
  const priorityAirdrop = favoriteAirdrops.reduce(
    (
      max: FavoriteAirdrop & { pendingCount: number },
      airdrop: FavoriteAirdrop,
    ) => {
      const pendingCount =
        (airdrop.daily_tasks.filter((task: TaskStatus) => !task.completed)
          .length || 0) +
        (airdrop.general_tasks.filter((task: TaskStatus) => !task.completed)
          .length || 0);

      return pendingCount > max.pendingCount
        ? { ...airdrop, pendingCount }
        : max;
    },
    { pendingCount: 0, name: "" } as FavoriteAirdrop & { pendingCount: number },
  );

  // Manejo de usuario no autenticado
  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-center">
          <p className="text-neutral-100 text-xl">{t("auth.please_login")}</p>
          <Button as={Link} className="mt-4" color="primary" to="/login">
            {t("navbar.login")}
          </Button>
        </div>
      </section>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <section className="flex flex-col items-center justify-center w-full h-full">
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
      </section>
    );
  }

  // Mostrar spinner durante carga
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center w-full">
        <Spinner className="mx-auto" size="lg" />
      </section>
    );
  }

  // Manejo de no airdrops en favoritos
  if (favorites.size === 0) {
    return (
      <section className="flex flex-col items-center justify-center w-full h-full">
        <Card
          className="bg-default-100 border border-default-200 w-full max-w-md"
          radius="none"
          shadow="none"
        >
          <CardBody className="p-0">
            <div className="text-center text-neutral-100 text-xl font-light flex flex-col items-center justify-center gap-4 py-10">
              <Image
                alt="No airdrops started"
                height={250}
                src="/images/bad.png"
                width={250}
              />
              <p>{t("favorites.no_airdrops_started")}</p>
              <Button
                as={Link}
                className="font-semibold text-lg"
                color="primary"
                to="/airdrops"
              >
                {t("favorites.start_airdrops")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-start w-full mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Caja de airdrops con tareas pendientes */}
        <div className="lg:col-span-2 w-full flex flex-col gap-4">
          <SectionHeader title={t("favorites.pending_tasks_title")} />
          {favoriteAirdrops.length === 0 ? (
            <Card
              className="bg-default-100 border border-default-200 flex-1"
              radius="none"
              shadow="none"
            >
              <CardBody className="p-0">
                <div className="text-center text-neutral-100 text-xl font-light flex flex-col items-center justify-center gap-4 py-10 h-full">
                  <Image
                    alt="All tasks completed"
                    height={250}
                    src="/images/completed.png"
                    width={250}
                  />
                  <Button
                    as={Link}
                    className="font-semibold text-lg"
                    color="primary"
                    to="/airdrops"
                  >
                    {t("favorites.explore_airdrops")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-0">
                {favoriteAirdrops.map((airdrop) => (
                  <AirdropCard key={airdrop.id} airdrop={airdrop} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tarjeta informativa */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-w-[300px]">
          <SectionHeader title={t("favorites.stats.title")} />
          <Card
            className="bg-default-50 border border-default-200 flex-1"
            radius="none"
            shadow="none"
          >
            <CardBody className="flex flex-col gap-2 p-0">
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.total_airdrops")}
                </p>
                <p className="text-success text-base">{totalAirdrops}</p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.daily_tasks_pending")}
                </p>
                <p className="text-success text-base">{dailyTasksPending}</p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.general_tasks_pending")}
                </p>
                <p className="text-success text-base">{generalTasksPending}</p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.time_until_reset")}
                </p>
                <p className="text-success text-base">{timeUntilReset}</p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.task_progress")}
                </p>
                <p className="text-success text-base">{taskProgress}%</p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.total_invested")}
                </p>
                <p className="text-success text-base">
                  ${totalInvested.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between p-4 border-b border-default-200">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.total_received")}
                </p>
                <p className="text-success text-base">
                  ${totalReceived.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between p-4">
                <p className="text-neutral-300 text-base font-semibold">
                  {t("favorites.stats.priority_airdrop")}
                </p>
                <p className="text-success text-base">
                  {priorityAirdrop.name || t("favorites.stats.no_priority")}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WatchList;
