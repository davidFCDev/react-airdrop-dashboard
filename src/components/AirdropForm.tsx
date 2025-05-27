import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";

import { useUserAuth } from "@/context/AuthContext";
import { useAirdropForm } from "@/hooks/useAirdropForm";
import {
  Airdrop,
  confirmation,
  cost,
  stages,
  status,
  tiers,
  types,
} from "@/types";

interface Props {
  onSubmit: () => void;
  initialAirdrop?: Airdrop;
}

const AirdropForm = ({ onSubmit, initialAirdrop }: Props) => {
  const { user, role } = useUserAuth();
  const navigate = useNavigate();

  const {
    formData,
    dailyTask,
    generalTask,
    backdrop,
    image,
    tagInput,
    error,
    uploading,
    handleChange,
    handleTaskChange,
    handleAddTask,
    handleFileChange,
    handleTagChange,
    handleAddTag,
    handleTagKeyPress,
    handleRemoveTag,
    handleSubmit,
    importantLinkInput,
    handleImportantLinkChange,
    handleAddImportantLink,
    handleRemoveImportantLink,
  } = useAirdropForm({ onSubmit, initialAirdrop });

  if (!user) {
    return <div className="text-red-500">Debes iniciar sesión</div>;
  }

  if (role !== "admin") {
    navigate("/unauthorized", { replace: true });
  }

  return (
    <form className="w-full p-6" onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* Información Básica */}
      <Card className="mb-6 bg-default-50" shadow="none">
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
            label="Confirmación"
            name="confirmation"
            selectedKeys={[formData.confirmation]}
            onChange={handleChange}
          >
            {confirmation.map((option) => (
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
      <Card className="mb-6 bg-default-50" shadow="none">
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

      {/* Tags */}
      <Card className="mb-6 bg-default-50" shadow="none">
        <CardHeader>
          <h2 className="text-2xl font-bold">Etiquetas</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              label="Añadir Etiqueta"
              placeholder="Escribe una etiqueta"
              value={tagInput}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyPress}
            />
            <Button
              disabled={!tagInput.trim()}
              variant="flat"
              onPress={handleAddTag}
            >
              Añadir
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-default-100 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    className="ml-2 text-red-500"
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Imágenes */}
      <Card className="mb-6 bg-default-50" shadow="none">
        <CardHeader>
          <h2 className="text-2xl font-bold">Imágenes</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-2 border-dashed border-default-200 p-4 rounded-lg flex flex-col items-center gap-2 md:col-span-3">
            <p className="font-semibold">Banner (Backdrop)</p>
            <Input
              accept="image/*"
              className="w-full"
              type="file"
              onChange={(e) => handleFileChange(e, "backdrop")}
            />
            {backdrop.preview && (
              <img
                alt="Backdrop preview"
                className="mt-2 max-h-40 object-contain"
                src={backdrop.preview}
              />
            )}
          </div>
          <div className="border-2 border-dashed border-default-200 p-4 rounded-lg flex flex-col items-center gap-2 md:col-span-1">
            <p className="font-semibold">Avatar</p>
            <Input
              accept="image/*"
              className="w-full"
              type="file"
              onChange={(e) => handleFileChange(e, "image")}
            />
            {image.preview && (
              <img
                alt="Avatar preview"
                className="mt-2 max-h-20 object-contain"
                src={image.preview}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Enlaces Importantes */}
      <Card className="mb-6 bg-default-50" shadow="none">
        <CardHeader>
          <h2 className="text-2xl font-bold">Enlaces Importantes</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              label="Nombre del Enlace"
              placeholder="Ej. Whitepaper"
              value={importantLinkInput.key}
              onChange={(e) => handleImportantLinkChange("key", e.target.value)}
            />
            <Input
              label="URL"
              placeholder="Ej. https://example.com/whitepaper"
              type="url"
              value={importantLinkInput.value}
              onChange={(e) =>
                handleImportantLinkChange("value", e.target.value)
              }
            />
            <Button
              disabled={
                !importantLinkInput.key.trim() ||
                !importantLinkInput.value.trim()
              }
              variant="flat"
              onPress={handleAddImportantLink}
            >
              Añadir
            </Button>
          </div>
          {formData.important_links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.important_links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center bg-default-100 px-2 py-1 rounded-full text-sm"
                >
                  {link.key}: {link.value}
                  <button
                    className="ml-2 text-red-500"
                    type="button"
                    onClick={() => handleRemoveImportantLink(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Tareas */}
      <Card className="mb-6 bg-default-50" shadow="none">
        <CardHeader>
          <h2 className="text-2xl font-bold">Tareas</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Tareas Diarias</h3>
            <Input
              label="Tarea Diaria (Inglés)"
              placeholder="Daily task in English"
              value={dailyTask.en}
              onChange={(e) => handleTaskChange("daily", "en", e.target.value)}
            />
            <Input
              label="Tarea Diaria (Español)"
              placeholder="Tarea diaria en Español"
              value={dailyTask.es}
              onChange={(e) => handleTaskChange("daily", "es", e.target.value)}
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
              value={generalTask.en}
              onChange={(e) =>
                handleTaskChange("general", "en", e.target.value)
              }
            />
            <Input
              label="Tarea General (Español)"
              placeholder="Tarea general en Español"
              value={generalTask.es}
              onChange={(e) =>
                handleTaskChange("general", "es", e.target.value)
              }
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
        disabled={uploading}
        isLoading={uploading}
        type="submit"
        variant="solid"
      >
        {uploading
          ? "Guardando..."
          : initialAirdrop
            ? "Actualizar Airdrop"
            : "Guardar Airdrop"}
      </Button>
    </form>
  );
};

export default AirdropForm;
