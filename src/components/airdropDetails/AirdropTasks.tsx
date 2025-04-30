import { useTranslation } from "react-i18next";

import AirdropDailyTasks from "./AirdropDailyTasks";
import AirdropGeneralTasks from "./AirdropGeneralTasks";

import { Airdrop } from "@/types";

interface AirdropTasksProps {
  airdrop: Airdrop;
  completedTasks: Set<string>;
  handleTaskToggle: (task: string) => void;
}

const AirdropTasks = ({
  airdrop,
  completedTasks,
  handleTaskToggle,
}: AirdropTasksProps) => {
  const { i18n } = useTranslation();

  const getTaskText = (task: { en: string; es: string }) =>
    i18n.language === "es" ? task.es : task.en;

  return (
    <>
      {airdrop.user.daily_tasks.length > 0 &&
        airdrop.user.general_tasks.length > 0 && (
          <div className="flex flex-col gap-4 w-full">
            {airdrop.user.daily_tasks.length > 0 && (
              <AirdropDailyTasks
                airdrop={airdrop}
                completedTasks={completedTasks}
                getTaskText={getTaskText}
                handleTaskToggle={handleTaskToggle}
              />
            )}
            {airdrop.user.general_tasks.length > 0 && (
              <AirdropGeneralTasks
                airdrop={airdrop}
                completedTasks={completedTasks}
                getTaskText={getTaskText}
                handleTaskToggle={handleTaskToggle}
              />
            )}
          </div>
        )}
    </>
  );
};

export default AirdropTasks;
