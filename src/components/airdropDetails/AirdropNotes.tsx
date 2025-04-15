import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";

interface Note {
  id: string;
  text: string;
  created_at: string;
}

interface Props {
  notes: Note[];
  newNote: string;
  setNewNote: (value: string) => void;
  handleAddNote: () => void;
  removeNote: (noteId: string) => void;
}

const AirdropNotes = ({
  notes,
  newNote,
  setNewNote,
  handleAddNote,
  removeNote,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="bg-default-100 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">{t("airdrop.notes")}</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder={t("airdrop.add_note")}
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button
          color="primary"
          disabled={!newNote.trim()}
          variant="solid"
          onPress={handleAddNote}
        >
          {t("airdrop.add")}
        </Button>
      </div>
      <ul className="list-disc pl-5">
        {notes.length > 0 ? (
          notes.map((note) => (
            <li
              key={note.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{note.text}</span>
              <Button
                color="danger"
                size="sm"
                variant="ghost"
                onPress={() => removeNote(note.id)}
              >
                {t("airdrop.delete")}
              </Button>
            </li>
          ))
        ) : (
          <li>{t("airdrop.no_notes")}</li>
        )}
      </ul>
    </div>
  );
};

export default AirdropNotes;
