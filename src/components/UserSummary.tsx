import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { useTranslation } from "react-i18next";

import { useUserAuth } from "@/context/AuthContext";
import { useFavoriteAirdropSummaries } from "@/hooks/useDashboard";
import { useAirdropStore } from "@/store/airdropStore";

const UserSummary = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { airdrops, favorites } = useAirdropStore();
  const { totalTasks, completedTasks } = useFavoriteAirdropSummaries();

  const favoriteAirdrops = airdrops.filter((airdrop) =>
    favorites.has(airdrop.id),
  );
  const totalFavorites = favoriteAirdrops.length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="w-full h-full bg-default-50" shadow="none">
      <CardHeader className="flex flex-col items-start">
        <Avatar
          className="mb-2"
          name={user?.email?.charAt(0).toUpperCase() || "?"}
          size="lg"
          src={user?.photoURL || undefined}
        />
        <h2 className="text-lg font-bold">{user?.email || t("user.guest")}</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div>
          <p className="font-semibold">{t("user.total_favorites")}</p>
          <p>{totalFavorites}</p>
        </div>
        <div>
          <p className="font-semibold">{t("user.completed_tasks")}</p>
          <p>{`${completedTasks} / ${totalTasks}`}</p>
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress
            showValueLabel
            aria-label="Tasks progress"
            color="success"
            formatOptions={{ style: "percent" }}
            size="lg"
            value={progress}
          />
          <p className="text-sm mt-2">{t("user.tasks_progress")}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserSummary;
