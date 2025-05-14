import { Checkbox } from "@heroui/checkbox";
import { useTranslation } from "react-i18next";

import { Airdrop } from "@/types";

interface AirdropGeneralTasksProps {
  airdrop: Airdrop;
  completedTasks: Set<string>;
  handleTaskToggle: (task: string) => void;
  getTaskText: (task: { en: string; es: string }) => string;
  isUpdating: boolean;
}

const AirdropGeneralTasks = ({
  airdrop,
  completedTasks,
  handleTaskToggle,
  getTaskText,
  isUpdating,
}: AirdropGeneralTasksProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-default-50 border border-default-200 p-6 w-full">
      {airdrop.user.general_tasks.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">
            {t("airdrop.general_tasks")}
          </h3>
          <ul className="list-none pl-0">
            {airdrop.user.general_tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <Checkbox
                  isDisabled={isUpdating}
                  isSelected={completedTasks.has(`general_${index}`)}
                  onChange={() => handleTaskToggle(`general_${index}`)}
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

export default AirdropGeneralTasks;
