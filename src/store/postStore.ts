import { collection, onSnapshot } from "firebase/firestore";
import { create } from "zustand";

import { db } from "@/lib/firebase";
import { Post } from "@/service/post.service";

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: true,
  error: null,

  fetchPosts: () => {
    const q = collection(db, "posts");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postData: Post[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            image: data.image || "",
            title:
              typeof data.title === "string"
                ? { en: data.title, es: data.title }
                : data.title,
            subtitle:
              typeof data.subtitle === "string"
                ? { en: data.subtitle, es: data.subtitle }
                : data.subtitle,
            description:
              typeof data.description === "string"
                ? { en: data.description, es: data.description }
                : data.description,
            links: data.links || [],
            created_at: data.created_at || new Date().toISOString(),
            last_edited: data.last_edited || new Date().toISOString(),
          };
        });

        set({ posts: postData, loading: false });
      },
      (err) => {
        set({ error: `Error fetching posts: ${err.message}`, loading: false });
      },
    );

    return unsubscribe;
  },
}));
