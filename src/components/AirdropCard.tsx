import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Link as HeroUILink } from "@heroui/link";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  Airdrop,
  costColorMap,
  statusColorMap,
  tierColorMap,
} from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
}

const AirdropCard = ({ airdrop }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/airdrops/${airdrop.id}`, { state: { airdrop } });
  };

  return (
    <Card
      isPressable
      className="w-full h-40 bg-default-50 cursor-pointer hover:bg-default-100 transition-colors border border-default-200 flex flex-col"
      radius="none"
      shadow="sm"
      onPress={handleCardClick}
    >
      <CardHeader className="flex flex-col gap-3 flex-grow">
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

        <div className="flex gap-2 flex-wrap w-full min-h-[2.5rem]">
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
    </Card>
  );
};

export default AirdropCard;
