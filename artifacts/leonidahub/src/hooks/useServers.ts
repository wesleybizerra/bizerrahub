import { useEffect, useState } from "react";
import {
    collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ServerDoc {
    id: string;
    rank: number;
    rankChange: number;
    trending: boolean;
    featured: boolean;
    name: string;
    slug: string;
    country: string;
    style: string;
    allowlist: boolean;
    level: "beginner" | "veteran" | "all";
    rating: number;
    reviewCount: number;
    description: string;
    badges: string[];
    game: "gtav" | "gta6";
    officialLink: string;
    howToEnter: string;
}

export function useServers() {
    const [servers, setServers] = useState<ServerDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "servers"), orderBy("rank", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setServers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
            setLoading(false);
        });
        return unsub;
    }, []);

    return { servers, loading };
}

export async function createServer(data: Omit<ServerDoc, "id">) {
    await addDoc(collection(db, "servers"), { ...data, createdAt: serverTimestamp() });
}

export async function updateServer(id: string, data: Partial<ServerDoc>) {
    await updateDoc(doc(db, "servers", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteServer(id: string) {
    await deleteDoc(doc(db, "servers", id));
}
