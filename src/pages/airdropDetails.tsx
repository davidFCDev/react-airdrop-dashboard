import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Progress } from "@heroui/progress";
import React from "react";
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

  const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(
    new Set(),
  );
  const [notes, setNotes] = React.useState<string[]>(airdrop?.user.notes || []);
  const [newNote, setNewNote] = React.useState<string>("");

  if (!airdrop) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start p-10">
          <h1 className="text-2xl font-bold">{t("airdrop.notFound")}</h1>
        </section>
      </DefaultLayout>
    );
  }

  const totalTasks =
    airdrop.user.daily_tasks.length + airdrop.user.general_tasks.length;
  const progress =
    totalTasks > 0 ? (completedTasks.size / totalTasks) * 100 : 0;

  const handleTaskToggle = (task: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(task)) {
        newSet.delete(task);
      } else {
        newSet.add(task);
      }

      return newSet;
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes((prev) => [...prev, newNote.trim()]);
      setNewNote("");
    }
  };

  // Mapear el color del status a una clase de Tailwind
  const statusDotColor = {
    success: "bg-success-500",
    warning: "bg-warning-500",
    default: "bg-default-500",
    danger: "bg-danger-500",
  }[statusColorMap[airdrop.status]];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start p-4 w-full">
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

        {/* Contenido Principal */}
        <div className="w-full px-10 mt-6">
          {/* Fila 2: Dos Columnas */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Columna 1: Nombre, Status Dot, Información Principal y Notas */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {/* Fila 1: Nombre y Status Dot */}
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-5xl font-bold">{airdrop.name}</h1>
                <div
                  className={`w-8 h-8 rounded-full animate-pulse ${statusDotColor}`}
                />
              </div>

              {/* Subfila 1: Progress con % superpuesto */}
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

              {/* Subfila 2: Tier, Type y Links */}
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

              {/* Subfila 3: Cost, Chain, Stage, Funding */}
              <div className="flex items-center gap-4 flex-wrap">
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

              {/* Subfila 4: Tags */}
              <div className="flex gap-2 flex-wrap">
                {airdrop.tags.map((tag, index) => (
                  <Chip key={index} color="default" size="lg" variant="flat">
                    {tag}
                  </Chip>
                ))}
              </div>

              {/* Subfila 5: Created y Last Edited */}
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold">
                    {t("airdrop.created_at")}:{" "}
                  </span>
                  <span>
                    {new Date(airdrop.created_at).toLocaleDateString()}
                  </span>
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
            </div>

            {/* Columna 2: Descripción, Links y Tasks */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              {/* Fila 1: Descripción */}
              <p className="text-lg p-6 bg-default-100 rounded-lg">
                {airdrop.description}
              </p>

              {/* Fila 2: Links y Tasks en tres columnas */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Subcolumna 1: Important Links */}
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

                {/* Subcolumna 2: Daily Tasks */}
                <div className="w-full md:w-1/3 bg-default-100 p-6 rounded-lg">
                  {airdrop.user.daily_tasks.length > 0 && (
                    <>
                      <h2 className="text-xl font-semibold mb-2">
                        Daily Tasks
                      </h2>
                      <ul className="list-none pl-0">
                        {airdrop.user.daily_tasks.map((task, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Checkbox
                              isSelected={completedTasks.has(task)}
                              onChange={() => handleTaskToggle(task)}
                            />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Subcolumna 3: General Tasks */}
                <div className="w-full md:w-1/3 bg-default-100 p-6 rounded-lg">
                  {airdrop.user.general_tasks.length > 0 && (
                    <>
                      <h2 className="text-xl font-semibold mb-2">
                        General Tasks
                      </h2>
                      <ul className="list-none pl-0">
                        {airdrop.user.general_tasks.map((task, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Checkbox
                              isSelected={completedTasks.has(task)}
                              onChange={() => handleTaskToggle(task)}
                            />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Fila 3: Input para Notas */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button color="primary" variant="solid" onPress={handleAddNote}>
                  Add
                </Button>
              </div>
              <div className="bg-default-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Notes</h2>
                <ul className="list-disc pl-5">
                  {notes.length > 0 ? (
                    notes.map((note, index) => <li key={index}>{note}</li>)
                  ) : (
                    <li>No notes added yet</li>
                  )}
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
