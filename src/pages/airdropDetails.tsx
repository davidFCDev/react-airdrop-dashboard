import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import AirdropDescription from "@/components/airdropDetails/AirdropDescription";
import AirdropHeader from "@/components/airdropDetails/AirdropHeader";
import AirdropInfo from "@/components/airdropDetails/AirdropInfo";
import AirdropNotes from "@/components/airdropDetails/AirdropNotes";
import AirdropTasks from "@/components/airdropDetails/AirdropTasks";
import { useUserAirdrop } from "@/hooks/useUserAirdrop";
import DefaultLayout from "@/layouts/default";

const AirdropDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const {
    airdrop,
    userAirdropData,
    completedTasks,
    notes,
    progress,
    loading,
    error,
    toggleTask,
    addNote,
    removeNote,
    updateInvestment,
  } = useUserAirdrop(id || "");
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote);
      setNewNote("");
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center p-10 min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </DefaultLayout>
    );
  }

  if (error || !id) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start p-10">
          <h1 className="text-2xl font-bold">
            {error || t("airdrop.invalid_id")}
          </h1>
        </section>
      </DefaultLayout>
    );
  }

  if (!airdrop) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start p-10">
          <h1 className="text-2xl font-bold">{t("airdrop.not_found")}</h1>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start p-4 w-full">
        <AirdropHeader airdrop={airdrop} />
        <div className="w-full px-10 mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <AirdropInfo airdrop={airdrop} progress={progress} />
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <AirdropDescription airdrop={airdrop} />
              <AirdropTasks
                airdrop={airdrop}
                completedTasks={completedTasks}
                handleTaskToggle={(task: string) => {
                  const [type, index] = task.split("_");

                  toggleTask(type as "daily" | "general", parseInt(index));
                }}
              />
              <AirdropNotes
                handleAddNote={handleAddNote}
                invested={userAirdropData?.invested || 0}
                newNote={newNote}
                notes={notes}
                received={userAirdropData?.received || 0}
                removeNote={removeNote}
                setNewNote={setNewNote}
                updateInvestment={updateInvestment}
              />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default AirdropDetailsPage;
