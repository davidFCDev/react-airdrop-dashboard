import { Checkbox } from "@heroui/checkbox";
import { useTranslation } from "react-i18next";

import { Airdrop } from "@/types";

interface AirdropDailyTasksProps {
  airdrop: Airdrop;
  completedTasks: Set<string>;
  handleTaskToggle: (task: string) => void;
  getTaskText: (task: { en: string; es: string }) => string;
}

const AirdropDailyTasks = ({
  airdrop,
  completedTasks,
  handleTaskToggle,
  getTaskText,
}: AirdropDailyTasksProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-default-100 border border-default-200 p-6 w-full">
      {airdrop.user.daily_tasks.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">
            {t("airdrop.daily_tasks")}
          </h3>
          <ul className="list-none pl-0">
            {airdrop.user.daily_tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <Checkbox
                  isSelected={completedTasks.has(`daily_${index}`)}
                  onChange={() => handleTaskToggle(`daily_${index}`)}
                />
                <span>{getTaskText(task)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AirdropDailyTasks;
