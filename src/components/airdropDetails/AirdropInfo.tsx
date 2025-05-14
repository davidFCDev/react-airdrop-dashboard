import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { useTranslation } from "react-i18next";

import {
  costColorMap,
  stageColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";
import { Airdrop } from "@/types";

interface Props {
  airdrop: Airdrop;
  progress: number;
}

const AirdropInfo = ({ airdrop, progress }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-4 bg-default-50 border border-default-200 p-6">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[2.7rem] font-bold">{airdrop.name}</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Chip
          className="capitalize"
          color={tierColorMap[airdrop.tier]}
          size="md"
          variant="flat"
        >
          Tier {airdrop.tier}
        </Chip>
        <Chip
          className="capitalize"
          color={costColorMap[airdrop.cost]}
          size="md"
          variant="flat"
        >
          {airdrop.cost}
        </Chip>
        <Chip
          className="capitalize"
          color={typeColorMap[airdrop.type]}
          size="md"
          variant="flat"
        >
          {airdrop.type}
        </Chip>
        <Chip
          className="capitalize"
          color={stageColorMap[airdrop.stage]}
          size="md"
          variant="flat"
        >
          {airdrop.stage}
        </Chip>
        <Chip className="capitalize" color="default" size="md" variant="flat">
          {airdrop.chain}
        </Chip>
      </div>
      <div className="flex flex-col gap-2">
        {airdrop.tags.length > 0 && (
          <span className="text-sm font-semibold text-default-600">
            {t("airdrop.tags")}
          </span>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {airdrop.tags.map((tag, index) => (
            <Chip key={index} color="default" size="lg" variant="flat">
              {tag}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-default-600">
          {t("airdrop.funding")}
        </span>
        <span className="text-lg">{`${airdrop.funding} $ `}</span>
      </div>
      <div className="flex gap-2">
        <div>
          <span className="text-sm font-semibold text-default-600">
            {t("airdrop.created_at")}:{" "}
          </span>
          <span>{new Date(airdrop.created_at).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-default-600">
            {t("airdrop.last_edited")}:{" "}
          </span>
          <span>{new Date(airdrop.last_edited).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="relative flex flex-col gap-2 mb-4">
        <span className="text-sm font-semibold text-default-600">
          {t("airdrop.progress")}
        </span>
        <div className="flex items-center gap-2 w-full">
          <Progress
            aria-label="Airdrop progress"
            className="w-96"
            color="success"
            showValueLabel={false}
            value={progress}
          />
          <span className=" flex items-center justify-center text-white text-sm font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AirdropInfo;
