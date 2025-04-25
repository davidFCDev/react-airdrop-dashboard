import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

interface Props {
  handleAddNote: () => void;
  newNote: string;
  notes: Note[];
  removeNote: (id: string) => void;
  setNewNote: (value: string) => void;
  invested: number;
  received: number;
  updateInvestment: (invested: number, received: number) => void;
}

const AirdropNotes = ({
  handleAddNote,
  newNote,
  notes,
  removeNote,
  setNewNote,
  invested,
  received,
  updateInvestment,
}: Props) => {
  const { t } = useTranslation();
  const [investedInput, setInvestedInput] = useState(invested.toString());
  const [receivedInput, setReceivedInput] = useState(received.toString());

  const handleInvestmentChange = () => {
    const newInvested = parseFloat(investedInput) || 0;
    const newReceived = parseFloat(receivedInput) || 0;

    updateInvestment(newInvested, newReceived);
  };

  return (
    <Card className="w-80 bg-default-100">
      <CardBody className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">{t("airdrop.notes")}</h3>
        <div className="flex gap-2">
          <Input
            placeholder={t("airdrop.add_note")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button color="primary" onPress={handleAddNote}>
            {t("airdrop.add")}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {notes.map((note) => (
            <div key={note.id} className="flex justify-between items-center">
              <p className="text-sm">{note.content}</p>
              <Button
                color="danger"
                size="sm"
                onPress={() => removeNote(note.id)}
              >
                {t("airdrop.delete")}
              </Button>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-bold">{t("airdrop.investment")}</h3>
        <div className="flex flex-col gap-2">
          <Input
            label={t("airdrop.invested")}
            type="number"
            value={investedInput}
            onBlur={handleInvestmentChange}
            onChange={(e) => setInvestedInput(e.target.value)}
          />
          <Input
            label={t("airdrop.received")}
            type="number"
            value={receivedInput}
            onBlur={handleInvestmentChange}
            onChange={(e) => setReceivedInput(e.target.value)}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default AirdropNotes;
