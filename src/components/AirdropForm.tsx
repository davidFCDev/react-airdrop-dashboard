import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

import {
  Airdrop,
  cost,
  stages,
  status,
  tiers,
  types,
} from "@/constants/airdrop.table";
import { airdropService } from "@/service/airdrop.service";

interface Props {
  onSubmit: () => void;
}

const AirdropForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState<Omit<Airdrop, "id">>({
    name: "",
    type: "Play-to-Earn",
    description: { en: "", es: "" },
    status: "Active",
    tier: "S",
    funding: "",
    cost: "FREE",
    stage: "Testnet",
    chain: "",
    tags: [],
    url: "",
    discord: "",
    twitter: "",
    telegram: "",
    backdrop: "",
    image: "",
    created_at: new Date().toISOString(),
    last_edited: new Date().toISOString(),
    important_links: [],
    user: { daily_tasks: [], general_tasks: [], notes: [] },
  });

  const [dailyTaskEn, setDailyTaskEn] = useState("");
  const [dailyTaskEs, setDailyTaskEs] = useState("");
  const [generalTaskEn, setGeneralTaskEn] = useState("");
  const [generalTaskEs, setGeneralTaskEs] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "description_en") {
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, en: value },
      }));
    } else if (name === "description_es") {
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, es: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTask = (type: "daily" | "general") => {
    const taskEn = type === "daily" ? dailyTaskEn : generalTaskEn;
    const taskEs = type === "daily" ? dailyTaskEs : generalTaskEs;

    if (taskEn.trim() && taskEs.trim()) {
      const newTask = { en: taskEn.trim(), es: taskEs.trim() };

      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [type === "daily" ? "daily_tasks" : "general_tasks"]: [
            ...prev.user[type === "daily" ? "daily_tasks" : "general_tasks"],
            newTask,
          ],
        },
      }));
      if (type === "daily") {
        setDailyTaskEn("");
        setDailyTaskEs("");
      } else {
        setGeneralTaskEn("");
        setGeneralTaskEs("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await airdropService.createAirdrop(formData);
      onSubmit();
    } catch (error) {
      console.error("Error creando airdrop:", error);
    }
  };

  return (
    <form className="w-full p-6 relative" onSubmit={handleSubmit}>
      {/* Información Básica */}
      <Card className="w-full mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Información Básica</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Input
            required
            label="Nombre"
            name="name"
            placeholder="Nombre del airdrop"
            value={formData.name}
            onChange={handleChange}
          />
          <Select
            label="Tipo"
            name="type"
            selectedKeys={[formData.type]}
            onChange={handleChange}
          >
            {types.map((option) => (
              <SelectItem key={option} textValue={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Estado"
            name="status"
            selectedKeys={[formData.status]}
            onChange={handleChange}
          >
            {status.map((option) => (
              <SelectItem key={option} textValue={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Tier"
            name="tier"
            selectedKeys={[formData.tier]}
            onChange={handleChange}
          >
            {tiers.map((option) => (
              <SelectItem key={option} textValue={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Financiación"
            name="funding"
            placeholder="Cantidad en USD"
            type="text"
            value={formData.funding}
            onChange={handleChange}
          />
          <Select
            label="Costo"
            name="cost"
            selectedKeys={[formData.cost]}
            onChange={handleChange}
          >
            {cost.map((option) => (
              <SelectItem key={option} textValue={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Etapa"
            name="stage"
            selectedKeys={[formData.stage]}
            onChange={handleChange}
          >
            {stages.map((option) => (
              <SelectItem key={option} textValue={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Blockchain"
            name="chain"
            placeholder="Ej. Ethereum"
            value={formData.chain}
            onChange={handleChange}
          />
          <Textarea
            required
            className="md:col-span-2"
            label="Descripción (Inglés)"
            name="description_en"
            placeholder="Description in English"
            value={formData.description.en}
            onChange={handleChange}
          />
          <Textarea
            required
            className="md:col-span-2"
            label="Descripción (Español)"
            name="description_es"
            placeholder="Descripción en Español"
            value={formData.description.es}
            onChange={handleChange}
          />
        </CardBody>
      </Card>

      {/* Enlaces */}
      <Card className="w-full mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Enlaces</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Input
            label="URL"
            name="url"
            placeholder="https://example.com"
            type="url"
            value={formData.url}
            onChange={handleChange}
          />
          <Input
            label="Discord"
            name="discord"
            placeholder="https://discord.gg/..."
            type="url"
            value={formData.discord}
            onChange={handleChange}
          />
          <Input
            label="Twitter"
            name="twitter"
            placeholder="https://twitter.com/..."
            type="url"
            value={formData.twitter}
            onChange={handleChange}
          />
          <Input
            label="Telegram"
            name="telegram"
            placeholder="https://t.me/..."
            type="url"
            value={formData.telegram}
            onChange={handleChange}
          />
        </CardBody>
      </Card>

      {/* Imágenes */}
      <Card className="w-full mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Imágenes</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-2 border-dashed border-default-200 p-4 rounded-lg flex flex-col items-center gap-2 md:col-span-3">
            <p className="font-semibold">Banner (Backdrop)</p>
            <p className="text-sm text-default-500 text-center">
              Arrastra o selecciona una imagen (simulado)
            </p>
            <Button disabled>Subir Banner</Button>
          </div>
          <div className="border-2 border-dashed border-default-200 p-4 rounded-lg flex flex-col items-center gap-2 md:col-span-1">
            <p className="font-semibold">Avatar</p>
            <p className="text-sm text-default-500 text-center">
              Arrastra o selecciona una imagen (simulado)
            </p>
            <Button disabled>Subir Avatar</Button>
          </div>
        </CardBody>
      </Card>

      {/* Tareas */}
      <Card className="w-full mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Tareas</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Tareas Diarias</h3>
            <Input
              label="Tarea Diaria (Inglés)"
              placeholder="Daily task in English"
              value={dailyTaskEn}
              onChange={(e) => setDailyTaskEn(e.target.value)}
            />
            <Input
              label="Tarea Diaria (Español)"
              placeholder="Tarea diaria en Español"
              value={dailyTaskEs}
              onChange={(e) => setDailyTaskEs(e.target.value)}
            />
            <Button variant="flat" onPress={() => handleAddTask("daily")}>
              Añadir
            </Button>
            <ul className="list-disc pl-5">
              {formData.user.daily_tasks.map((task, index) => (
                <li key={index} className="text-sm">
                  {task.en} / {task.es}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Tareas Generales</h3>
            <Input
              label="Tarea General (Inglés)"
              placeholder="General task in English"
              value={generalTaskEn}
              onChange={(e) => setGeneralTaskEn(e.target.value)}
            />
            <Input
              label="Tarea General (Español)"
              placeholder="Tarea general en Español"
              value={generalTaskEs}
              onChange={(e) => setGeneralTaskEs(e.target.value)}
            />
            <Button variant="flat" onPress={() => handleAddTask("general")}>
              Añadir
            </Button>
            <ul className="list-disc pl-5">
              {formData.user.general_tasks.map((task, index) => (
                <li key={index} className="text-sm">
                  {task.en} / {task.es}
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>

      {/* Botón de Guardar */}
      <Button
        className="fixed bottom-6 right-6 z-10"
        color="primary"
        type="submit"
        variant="solid"
      >
        Guardar Airdrop
      </Button>
    </form>
  );
};

export default AirdropForm;
