import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Link as HeroUILink } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { DiscordIcon, TelegramIcon, TwitterIcon } from "./icons";

import { Airdrop } from "@/constants/airdrop.table";

const AirdropCard = (airdrop: Airdrop) => {
  const { i18n } = useTranslation();
  const description =
    i18n.language === "es" ? airdrop.description.es : airdrop.description.en;

  return (
    <Card className="w-[400px] bg-default-100" shadow="sm">
      <CardHeader className="flex justify-between items-start">
        <div className="flex gap-3">
          <Image
            alt={airdrop.name}
            height={60}
            radius="sm"
            src={airdrop.image}
            width={60}
          />
          <div className="flex flex-col text-left">
            <p className="text-xl font-bold">{airdrop.name}</p>
            <p className="text-small text-default-500">{airdrop.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {airdrop.status && (
            <p className="text-small text-success-500">{airdrop.status}</p>
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <HeroUILink
          isExternal
          color="foreground"
          href={airdrop.url}
          rel="noopener noreferrer"
        >
          {airdrop.url}
        </HeroUILink>
        <div className="flex gap-2">
          <HeroUILink isExternal href={airdrop.discord} title="Discord">
            <DiscordIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
          </HeroUILink>
          <HeroUILink isExternal href={airdrop.telegram} title="Telegram">
            <TelegramIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
          </HeroUILink>
          <HeroUILink isExternal href={airdrop.twitter} title="Twitter">
            <TwitterIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
          </HeroUILink>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AirdropCard;
