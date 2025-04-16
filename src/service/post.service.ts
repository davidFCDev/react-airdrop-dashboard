import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface Post {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  links: { key: string; value: string }[];
  created_at: string;
  last_edited: string;
}

export class PostService {
  async createPost(
    post: Omit<Post, "id" | "created_at" | "last_edited">,
  ): Promise<void> {
    const id = doc(collection(db, "posts")).id;
    const now = new Date().toISOString();

    await setDoc(doc(db, "posts", id), {
      ...post,
      id,
      created_at: now,
      last_edited: now,
    });
  }

  async getPost(id: string): Promise<Post | null> {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? (docSnap.data() as Post) : null;
  }

  async getAllPosts(): Promise<Post[]> {
    const querySnapshot = await getDocs(collection(db, "posts"));

    return querySnapshot.docs.map((doc) => doc.data() as Post);
  }
}

export const postService = new PostService();
