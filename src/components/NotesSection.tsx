import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { t } from "i18next";

import { Note } from "@/pages/dashboard";

interface NotesSectionProps {
  notes: Note[];
  newNote: string;
  setNewNote: (note: string) => void;
  handleAddNote: () => void;
  handleRemoveNote: (id: string) => void;
}

const NotesSection = ({
  newNote,
  setNewNote,
  handleAddNote,
  handleRemoveNote,
  notes,
}: NotesSectionProps) => {
  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex gap-2 w-full bg-default-50 p-4 border border-default-200">
        <Input
          placeholder={t("dashboard.add_note")}
          radius="none"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button color="primary" radius="none" onPress={handleAddNote}>
          {t("dashboard.add")}
        </Button>
      </div>
      <Card
        className="bg-default-50 min-h-96 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardBody className="flex flex-col gap-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-center p-4"
            >
              <p className="text-xl">{note.content}</p>
              <Button
                color="danger"
                size="sm"
                onPress={() => handleRemoveNote(note.id)}
              >
                {t("dashboard.delete")}
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
};

export default NotesSection;
