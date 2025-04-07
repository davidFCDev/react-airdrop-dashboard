import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Link } from "react-router-dom";

import { DiscordIcon, TelegramIcon, TwitterIcon } from "./icons";

type AirdropCardProps = {
  airdrop: {
    title: string;
    description: string;
    type: string;
    createdAt: string;
    startedAt: string;
    status?: string;
    image: string;
    url: string;
    discord?: string;
    twitter?: string;
    telegram?: string;
    important_links?: string[];
    tasks?: string[];
  };
};

const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  return (
    <Card className="w-[400px] bg-default-100" shadow="sm">
      <CardHeader className="flex justify-between items-start">
        <div className="flex gap-3">
          <Image
            alt="heroui logo"
            height={60}
            radius="sm"
            src={airdrop.image}
            width={60}
          />
          <div className="flex flex-col text-left">
            <p className="text-xl font-bold">{airdrop.title}</p>
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
        <p>{airdrop.description}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <Link rel="noopener noreferrer" target="_blank" to={airdrop.url}>
          {airdrop.url}
        </Link>
        <div className="flex gap-2">
          <DiscordIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
          <TelegramIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
          <TwitterIcon className="text-zinc-300 hover:text-primary cursor-pointer" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AirdropCard;
