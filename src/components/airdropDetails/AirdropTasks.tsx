import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { Airdrop } from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
  completedTasks: Set<string>;
  handleTaskToggle: (task: string) => void;
}

const AirdropTasks = ({ airdrop, completedTasks, handleTaskToggle }: Props) => {
  const { t, i18n } = useTranslation();

  const getTaskText = (task: { en: string; es: string }) =>
    i18n.language === "es" ? task.es : task.en;

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="w-full md:w-1/3 bg-default-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {t("airdrop.important_links")}
        </h2>
        <ul className="list-disc pl-5">
          {airdrop.important_links.map((link, index) => (
            <li key={index}>
              <span className="font-medium">{link.key}: </span>
              <Link isExternal color="primary" href={link.value}>
                {link.value}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-1/3 bg-default-100 p-6 rounded-lg">
        {airdrop.user.daily_tasks.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {t("airdrop.daily_tasks")}
            </h2>
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
      <div className="w-full md:w-1/3 bg-default-100 p-6 rounded-lg">
        {airdrop.user.general_tasks.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {t("airdrop.general_tasks")}
            </h2>
            <ul className="list-none pl-0">
              {airdrop.user.general_tasks.map((task, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Checkbox
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
    </div>
  );
};

export default AirdropTasks;
