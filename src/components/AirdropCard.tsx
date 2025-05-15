import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Link as HeroUILink } from "@heroui/link";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  DiscordIcon,
  StarFilledIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  costColorMap,
  statusColorMap,
  tierColorMap,
} from "@/constants/airdrop.table";
import { useAirdropStore } from "@/store/airdropStore";
import { Airdrop } from "@/types";

interface Props {
  airdrop: Airdrop;
  star?: boolean;
}

const AirdropCard = ({ airdrop, star }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, userAirdropData } = useAirdropStore();

  const handleCardClick = () => {
    navigate(`/airdrops/${airdrop.id}`, { state: { airdrop } });
  };

  // Verificar si el airdrop es favorito o tiene tareas iniciadas
  const showStar =
    star &&
    (() => {
      const data = userAirdropData.get(airdrop.id);
      const isFavorite = favorites.has(airdrop.id);
      const hasStartedTasks =
        data &&
        (data.daily_tasks.some((task) => task.completed) ||
          data.general_tasks.some((task) => task.completed));

      return isFavorite || hasStartedTasks;
    })();

  // Verificar si hay tareas pendientes
  const hasPendingTasks = (() => {
    const data = userAirdropData.get(airdrop.id);

    return (
      data &&
      (data.daily_tasks.some((task) => !task.completed) ||
        data.general_tasks.some((task) => !task.completed))
    );
  })();

  return (
    <Card
      isPressable
      className={`${star ? "h-40 min-w-60" : "h-40 min-w-64"} w-full bg-default-50 cursor-pointer hover:bg-default-100 transition-colors border border-default-200 flex flex-col relative`}
      radius="none"
      shadow="none"
      onPress={handleCardClick}
    >
      <CardHeader className="flex flex-col gap-3 flex-grow pb-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3 items-center">
            <Image
              alt={airdrop.name}
              height={50}
              radius="sm"
              src={airdrop.image}
              width={50}
            />
            <div className="flex flex-col text-left">
              <p className="text-2xl font-bold truncate">{airdrop.name}</p>
              <span className="text-xs text-default-600">{airdrop.type}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap w-full min-h-[2.5rem]">
          <Chip
            className="capitalize"
            color={statusColorMap[airdrop.status]}
            size="sm"
            variant="flat"
          >
            {airdrop.status}
          </Chip>
          <Chip
            className="capitalize"
            color={costColorMap[airdrop.cost]}
            size="sm"
            variant="flat"
          >
            {airdrop.cost}
          </Chip>
          <Chip
            className="capitalize"
            color={tierColorMap[airdrop.tier]}
            size="sm"
            variant="flat"
          >
            {t("airdrop.tier")} {airdrop.tier}
          </Chip>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-end gap-2">
        <div className="flex gap-2">
          {airdrop.url && (
            <HeroUILink
              isExternal
              color="foreground"
              href={airdrop.url}
              title="Website"
            >
              <WebsiteIcon className="w-5 h-5 text-zinc-300 hover:text-primary" />
            </HeroUILink>
          )}
          {airdrop.discord && (
            <HeroUILink
              isExternal
              color="foreground"
              href={airdrop.discord}
              title="Discord"
            >
              <DiscordIcon className="w-5 h-5 text-zinc-300 hover:text-primary" />
            </HeroUILink>
          )}
          {airdrop.twitter && (
            <HeroUILink
              isExternal
              color="foreground"
              href={airdrop.twitter}
              title="Twitter"
            >
              <TwitterIcon className="w-5 h-5 text-zinc-300 hover:text-primary" />
            </HeroUILink>
          )}
          {airdrop.telegram && (
            <HeroUILink
              isExternal
              color="foreground"
              href={airdrop.telegram}
              title="Telegram"
            >
              <TelegramIcon className="w-5 h-5 text-zinc-300 hover:text-primary" />
            </HeroUILink>
          )}
        </div>
      </CardFooter>

      {/* Icono de estrella */}
      {showStar && (
        <StarFilledIcon className="absolute top-2 right-2 w-5 h-5 text-warning" />
      )}
    </Card>
  );
};

export default AirdropCard;
