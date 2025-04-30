import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";

import { DeleteIcon } from "../icons";

import { AirdropNotesProps } from "@/types";

const AirdropNotes = ({
  handleAddNote,
  newNote,
  notes,
  removeNote,
  setNewNote,
}: AirdropNotesProps) => {
  const { t } = useTranslation();

  return (
    <Card
      className="flex flex-col gap-4 bg-default-100 border border-default-200 p-6 w-full md:w-1/3"
      radius="none"
      shadow="none"
    >
      <CardBody className="flex flex-col gap-4 p-0">
        <h3 className="text-lg font-bold">{t("airdrop.notes")}</h3>
        <div className="flex gap-2">
          <Input
            placeholder={t("airdrop.add_note")}
            value={newNote}
            variant="underlined"
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button
            isIconOnly
            color="primary"
            variant="faded"
            onPress={handleAddNote}
          >
            {t("airdrop.add")}
          </Button>
        </div>
        <ul className="list-disc pl-5">
          {notes.map((note) => (
            <li key={note.id} className="mb-2">
              <div className="flex justify-between items-center">
                <p>{note.text}</p>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => removeNote(note.id)}
                >
                  <DeleteIcon className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default AirdropNotes;
