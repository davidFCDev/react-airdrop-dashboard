import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";

interface Props {
  notes: string[];
  newNote: string;
  setNewNote: (value: string) => void;
  handleAddNote: () => void;
}

const AirdropNotes = ({ notes, newNote, setNewNote, handleAddNote }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2">
        <Input
          placeholder={t("airdrop.add_note")}
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button color="primary" variant="solid" onPress={handleAddNote}>
          {t("airdrop.add")}
        </Button>
      </div>
      <div className="bg-default-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{t("airdrop.notes")}</h2>
        <ul className="list-disc pl-5">
          {notes.length > 0 ? (
            notes.map((note, index) => <li key={index}>{note}</li>)
          ) : (
            <li>{t("airdrop.no_notes")}</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default AirdropNotes;
