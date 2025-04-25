import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AirdropCard from "@/components/AirdropCard";
import NotesSection from "@/components/dashboard/NotesSection";
import { AnnounceIcon, NewIcon, NotesIcon } from "@/components/icons";
import PostCard from "@/components/PostCard";
import UserSummary from "@/components/UserSummary";
import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { db } from "@/lib/firebase";
import { useAirdropStore } from "@/store/airdropStore";
import { usePostStore } from "@/store/postStore";

export interface Note {
  id: string;
  content: string;
  created_at: string;
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { airdrops, fetchAirdrops, fetchFavorites } = useAirdropStore();
  const { posts, fetchPosts } = usePostStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const unsubscribeAirdrops = fetchAirdrops();
    const unsubscribePosts = fetchPosts();
    let unsubscribeFavorites: (() => void) | undefined;
    let unsubscribeNotes: (() => void) | undefined;

    if (user?.uid) {
      unsubscribeFavorites = fetchFavorites(user.uid);
      const notesRef = doc(db, "user_notes", user.uid);

      unsubscribeNotes = onSnapshot(notesRef, (docSnap) => {
        if (docSnap.exists()) {
          setNotes(docSnap.data().notes || []);
        }
      });
    }

    return () => {
      unsubscribeAirdrops();
      unsubscribePosts();
      if (unsubscribeFavorites) unsubscribeFavorites();
      if (unsubscribeNotes) unsubscribeNotes();
    };
  }, [user, fetchAirdrops, fetchFavorites, fetchPosts]);

  const handleAddNote = async () => {
    if (!user?.uid || !newNote.trim()) return;
    const newNoteObj: Note = {
      id: new Date().toISOString(),
      content: newNote,
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNoteObj];

    try {
      await setDoc(doc(db, "user_notes", user.uid), { notes: updatedNotes });
      setNewNote("");
    } catch {
      // Handle error
    }
  };

  const handleRemoveNote = async (noteId: string) => {
    if (!user?.uid) return;
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    try {
      await setDoc(doc(db, "user_notes", user.uid), { notes: updatedNotes });
    } catch {
      // Handle error
    }
  };

  const latestAirdrops = airdrops
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6); // Mantener 6 airdrops

  const latestPosts = posts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10); // Limitar a 10 posts

  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row min-h-screen  pt-4 ">
        <div className="w-full md:w-72">
          <UserSummary />
        </div>
        <div className="w-full flex flex-col bg-default-100 border border-default-200 mr-4">
          <div>
            <h2 className="text-2xl font-bold p-4 bg-default-50 flex items-center">
              <NewIcon className="inline-block mr-2 text-primary" size={32} />
              {t("dashboard.latest_airdrops")}
            </h2>
            <Divider className="w-full" />
            <ScrollShadow className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4 p-4 overflow-y-auto">
              {latestAirdrops.length === 0 ? (
                <p className="text-sm text-default-500">
                  {t("dashboard.no_airdrops")}
                </p>
              ) : (
                latestAirdrops.map((airdrop) => (
                  <div key={airdrop.id}>
                    <AirdropCard airdrop={airdrop} />
                  </div>
                ))
              )}
            </ScrollShadow>
          </div>
          <Divider className="w-full" />
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold p-4 bg-default-50 flex items-center">
                <AnnounceIcon
                  className="inline-block mr-2 text-primary"
                  size={32}
                />
                {t("dashboard.important_news")}
              </h2>
              <Divider className="w-full" />
              <ScrollShadow className="flex flex-col gap-4 p-4 h-[39rem] overflow-y-auto">
                {latestPosts.map((post) => (
                  <div key={post.id} className="w-full">
                    <PostCard post={post} />
                  </div>
                ))}
              </ScrollShadow>
            </div>
            <div className="w-full md:w-1/2 border-l border-default-200 min-h-[28rem]">
              <h2 className="text-2xl font-bold p-4 bg-default-50 flex items-center">
                <NotesIcon
                  className="inline-block mr-2 text-primary"
                  size={32}
                />
                {t("dashboard.notes")}
              </h2>
              <Divider className="w-full" />
              <NotesSection
                handleAddNote={handleAddNote}
                handleRemoveNote={handleRemoveNote}
                newNote={newNote}
                notes={notes}
                setNewNote={setNewNote}
              />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default DashboardPage;
