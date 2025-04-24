import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { t } from "i18next";

import { CheckIcon, DeleteIcon } from "@/components/icons";
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
    <section className="flex flex-col gap-4 p-4 h-full">
      <div className="flex gap-2 w-full bg-default-50 p-4 border border-default-200">
        <Input
          aria-label={t("dashboard.add_note")}
          placeholder={t("dashboard.add_note")}
          radius="none"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button
          aria-label={t("dashboard.add")}
          color="primary"
          radius="none"
          onPress={handleAddNote}
        >
          {t("dashboard.add")}
        </Button>
      </div>
      <Card
        className="bg-default-50 border border-default-200 h-[32rem]"
        radius="none"
        shadow="none"
      >
        <ScrollShadow className="flex flex-col gap-2 p-4 h-full overflow-y-auto">
          <CardBody className="flex flex-col gap-2 p-0">
            {notes.length === 0 ? (
              <p className="text-sm text-default-500">
                {t("dashboard.no_notes")}
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex justify-between items-center"
                  role="listitem"
                >
                  <div className="flex items-center gap-2">
                    <CheckIcon
                      aria-hidden="true"
                      className="text-primary"
                      size={18}
                    />
                    <p className="font-light">{note.content}</p>
                  </div>
                  <Button
                    isIconOnly
                    aria-label={t("dashboard.delete_note")}
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => handleRemoveNote(note.id)}
                  >
                    <DeleteIcon size={18} />
                  </Button>
                </div>
              ))
            )}
          </CardBody>
        </ScrollShadow>
      </Card>
    </section>
  );
};

export default NotesSection;
