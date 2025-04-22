import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface Post {
  id: string;
  image: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
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

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    // Compatibilidad con posts existentes (si title, subtitle, description son strings)
    return {
      id: docSnap.id,
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
  }

  async getAllPosts(): Promise<Post[]> {
    const querySnapshot = await getDocs(collection(db, "posts"));

    return querySnapshot.docs.map((doc) => {
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
  }
}

export const postService = new PostService();
