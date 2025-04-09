import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons";
import {
  AIRDROP_LIST,
  Airdrop,
  costColorMap,
  stageColorMap,
  statusColorMap,
  tierColorMap,
  typeColorMap,
} from "@/constants/airdrop.table";
import DefaultLayout from "@/layouts/default";

const AirdropDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const airdrop = AIRDROP_LIST.find((a) => a.id === id) as Airdrop | undefined;

  if (!airdrop) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start min-h-screen p-10">
          <h1 className="text-2xl font-bold">{t("airdrop.notFound")}</h1>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start min-h-screen p-4 w-full">
        {/* Banner con Backdrop */}
        <div className="relative w-full h-64 overflow-y-hidden">
          <img
            alt={`${airdrop.name} backdrop`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={airdrop.backdrop}
          />
        </div>

        {/* Avatar, Nombre, Tier, Type y Links */}
        <div className="relative px-10 -mt-20">
          <img
            alt={airdrop.name}
            className="w-32 h-32 rounded-full border-8 border-default-50"
            src={airdrop.image}
          />
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{airdrop.name}</h1>
            <div className="flex items-center gap-4 mt-2">
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
          </div>
          <p className="text-lg text-default-600 mt-4">{airdrop.description}</p>
        </div>

        {/* Descripción */}

        {/* Contenido en Dos Columnas */}
        <div className="flex flex-col md:flex-row gap-6 w-full px-4">
          {/* Tarjeta Informativa (Izquierda) */}
          <div className="w-full md:w-2/3 bg-default-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">{t("airdrop.status")}: </span>
                <Chip
                  className="capitalize"
                  color={statusColorMap[airdrop.status]}
                  size="sm"
                  variant="flat"
                >
                  {airdrop.status}
                </Chip>
              </div>
              <div>
                <span className="font-semibold">{t("airdrop.stage")}: </span>
                <Chip
                  className="capitalize"
                  color={stageColorMap[airdrop.stage]}
                  size="sm"
                  variant="flat"
                >
                  {airdrop.stage}
                </Chip>
              </div>
              <div>
                <span className="font-semibold">{t("airdrop.chain")}: </span>
                <Chip
                  className="capitalize"
                  color="default"
                  size="sm"
                  variant="flat"
                >
                  {airdrop.chain}
                </Chip>
              </div>
              <div>
                <span className="font-semibold">{t("airdrop.cost")}: </span>
                <Chip
                  className="capitalize"
                  color={costColorMap[airdrop.cost]}
                  size="sm"
                  variant="flat"
                >
                  {airdrop.cost}
                </Chip>
              </div>
              <div>
                <span className="font-semibold">{t("airdrop.funding")}: </span>
                <span>{`$ ${airdrop.funding}`}</span>
              </div>
              <div>
                <span className="font-semibold">{t("airdrop.progress")}: </span>
                <span>{`${airdrop.progress}%`}</span>
              </div>
              <div>
                <span className="font-semibold">
                  {t("airdrop.created_at")}:{" "}
                </span>
                <span>{new Date(airdrop.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold">
                  {t("airdrop.last_edited")}:{" "}
                </span>
                <span>
                  {new Date(airdrop.last_edited).toLocaleDateString()}
                </span>
              </div>
            </div>
            {/* Tags */}
            <div className="mt-4">
              <span className="font-semibold">{t("airdrop.tags")}: </span>
              <div className="flex gap-2 flex-wrap mt-2">
                {airdrop.tags.map((tag, index) => (
                  <Chip key={index} color="default" size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Tareas y Enlaces Importantes (Derecha) */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            {/* Tareas */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                {t("airdrop.tasks")}
              </h2>
              <ul className="list-disc pl-5">
                {airdrop.user.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
            {/* Enlaces Importantes */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                {t("airdrop.important_links")}
              </h2>
              <ul className="list-disc pl-5">
                {airdrop.user.important_links.map((link, index) => (
                  <li key={index}>
                    <Link isExternal color="primary" href={link}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default AirdropDetailsPage;
