import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { db } from "@/lib/firebase";
import { useAirdropStore } from "@/store/airdropStore";

interface UserAirdropData {
  favorite: boolean;
  daily_tasks: { id: string; completed: boolean }[];
  general_tasks: { id: string; completed: boolean }[];
  notes: { id: string; content: string; created_at: string }[];
  invested: number;
  received: number;
}

const TrackerPage = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { airdrops, favorites } = useAirdropStore();
  const [userAirdropData, setUserAirdropData] = useState<
    Map<string, UserAirdropData>
  >(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);

      return;
    }

    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);

    if (favoriteAirdropIds.length === 0) {
      setLoading(false);

      return;
    }

    const unsubscribe = favoriteAirdropIds.map((airdropId) => {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      return onSnapshot(userAirdropRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserAirdropData((prev) =>
            new Map(prev).set(airdropId, docSnap.data() as UserAirdropData),
          );
        }
        setLoading(false);
      });
    });

    return () => unsubscribe.forEach((unsub) => unsub());
  }, [user, airdrops, favorites]);

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center p-10 min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </DefaultLayout>
    );
  }

  const favoriteAirdrops = airdrops.filter((airdrop) =>
    favorites.has(airdrop.id),
  );
  const totalProfit = favoriteAirdrops.reduce((sum, airdrop) => {
    const data = userAirdropData.get(airdrop.id);

    if (!data) return sum;

    return sum + (data.received - data.invested);
  }, 0);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-default-50" shadow="none">
          <CardHeader>
            <h1 className="text-3xl font-bold">{t("tracker.title")}</h1>
          </CardHeader>
          <CardBody>
            <div className="mb-4">
              <p className="text-lg text-default-600">
                {t("tracker.total_profit")}:{" "}
                <span
                  className={totalProfit >= 0 ? "text-success" : "text-danger"}
                >
                  {totalProfit.toFixed(2)} USD
                </span>
              </p>
            </div>
            <Table isCompact removeWrapper aria-label="Airdrop Tracker">
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
                  const invested = data?.invested || 0;
                  const received = data?.received || 0;
                  const profit = received - invested;
                  const roi = invested > 0 ? (profit / invested) * 100 : 0;

                  return (
                    <TableRow key={airdrop.id}>
                      <TableCell>{airdrop.name}</TableCell>
                      <TableCell>{invested.toFixed(2)} USD</TableCell>
                      <TableCell>{received.toFixed(2)} USD</TableCell>
                      <TableCell
                        className={profit >= 0 ? "text-success" : "text-danger"}
                      >
                        {profit.toFixed(2)} USD
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
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
};

export default TrackerPage;
