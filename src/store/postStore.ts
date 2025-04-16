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
        const postData: Post[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at || new Date().toISOString(),
          last_edited: doc.data().last_edited || new Date().toISOString(),
        })) as Post[];

        set({ posts: postData, loading: false });
      },
      (err) => {
        set({ error: `Error fetching posts: ${err.message}`, loading: false });
      },
    );

    return unsubscribe;
  },
}));
