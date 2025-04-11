import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Progress } from "@heroui/progress";
import { useTranslation } from "react-i18next";

import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  Airdrop,
  costColorMap,
  stageColorMap,
  statusColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
  progress: number;
}

const AirdropInfo = ({ airdrop, progress }: Props) => {
  const { t } = useTranslation();
  const statusDotColor = {
    success: "bg-success-500",
    warning: "bg-warning-500",
    default: "bg-default-500",
    danger: "bg-danger-500",
  }[statusColorMap[airdrop.status]];

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-5xl font-bold">{airdrop.name}</h1>
        <div
          className={`w-8 h-8 rounded-full animate-pulse ${statusDotColor}`}
        />
      </div>
      <div className="relative">
        <Progress
          aria-label="Airdrop progress"
          className="w-96"
          color="success"
          showValueLabel={false}
          value={progress}
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Chip
          className="capitalize"
          color={tierColorMap[airdrop.tier]}
          size="lg"
          variant="flat"
        >
          Tier {airdrop.tier}
        </Chip>
        <Chip
          className="capitalize"
          color={typeColorMap[airdrop.type]}
          size="lg"
          variant="flat"
        >
          {airdrop.type}
        </Chip>
        <div className="flex gap-3">
          <Link
            isExternal
            color="foreground"
            href={airdrop.url}
            title="Website"
          >
            <WebsiteIcon className="w-7 h-7" />
          </Link>
          <Link
            isExternal
            color="foreground"
            href={airdrop.discord}
            title="Discord"
          >
            <DiscordIcon className="w-7 h-7" />
          </Link>
          <Link
            isExternal
            color="foreground"
            href={airdrop.twitter}
            title="Twitter"
          >
            <TwitterIcon className="w-7 h-7" />
          </Link>
          <Link
            isExternal
            color="foreground"
            href={airdrop.telegram}
            title="Telegram"
          >
            <TelegramIcon className="w-7 h-7" />
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Chip
          className="capitalize"
          color={costColorMap[airdrop.cost]}
          size="lg"
          variant="flat"
        >
          {airdrop.cost}
        </Chip>
        <Chip className="capitalize" color="default" size="lg" variant="flat">
          {airdrop.chain}
        </Chip>
        <Chip
          className="capitalize"
          color={stageColorMap[airdrop.stage]}
          size="lg"
          variant="flat"
        >
          {airdrop.stage}
        </Chip>
        <span className="text-lg">{`$ ${airdrop.funding}`}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {airdrop.tags.map((tag, index) => (
          <Chip key={index} color="default" size="lg" variant="flat">
            {tag}
          </Chip>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-semibold">{t("airdrop.created_at")}: </span>
          <span>{new Date(airdrop.created_at).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="font-semibold">{t("airdrop.last_edited")}: </span>
          <span>{new Date(airdrop.last_edited).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AirdropInfo;
