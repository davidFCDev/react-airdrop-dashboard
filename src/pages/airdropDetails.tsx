import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Progress } from "@heroui/progress";
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

        {/* Avatar superpuesto */}
        <div className="relative px-10 -mt-20">
          <img
            alt={airdrop.name}
            className="w-32 h-32 rounded-full border-8 border-default-50"
            src={airdrop.image}
          />
        </div>

        {/* Contenido en Dos Columnas */}
        <div className="flex flex-col md:flex-row gap-6 w-full px-10 mt-6">
          {/* Columna 1: Información Principal */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            {/* Fila 1: Título */}
            <h1 className="text-5xl font-bold">{airdrop.name}</h1>

            {/* Fila 2: Tier, Type y Links */}
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

            {/* Fila 3: Cost, Chain, Stage, Funding */}
            <div className="flex items-center gap-4">
              <Chip
                className="capitalize"
                color={costColorMap[airdrop.cost]}
                size="lg"
                variant="flat"
              >
                {airdrop.cost}
              </Chip>
              <Chip
                className="capitalize"
                color="default"
                size="lg"
                variant="flat"
              >
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

            {/* Fila 4: Tags */}
            <div className="flex gap-2 flex-wrap">
              {airdrop.tags.map((tag, index) => (
                <Chip key={index} color="default" size="lg" variant="flat">
                  {tag}
                </Chip>
              ))}
            </div>

            {/* Fila 5: Created y Last Edited */}
            <div className="flex flex-col gap-2">
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

            {/* Fila 6: Progress con % */}
            <Progress
              aria-label="Airdrop progress"
              className="w-96"
              color="success"
              showValueLabel={true} // Muestra el % dentro de la barra
              value={airdrop.progress}
            />
          </div>

          {/* Columna 2: Descripción, Tasks y Links */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 mt-10">
            {/* Fila 1: Descripción */}
            <p className="text-lg text-default-700">{airdrop.description}</p>

            {/* Fila 2: Tasks y Links en dos columnas */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Columna 1: Tasks */}
              <div className="w-full sm:w-1/2 bg-default-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  {t("airdrop.tasks")}
                </h2>
                <ul className="list-disc pl-5">
                  {airdrop.user.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>

              {/* Columna 2: Links */}
              <div className="w-full sm:w-1/2 bg-default-50 p-6 rounded-lg">
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
        </div>
      </section>
    </DefaultLayout>
  );
};

export default AirdropDetailsPage;
