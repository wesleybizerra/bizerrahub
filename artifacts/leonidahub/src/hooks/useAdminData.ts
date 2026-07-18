import { useEffect, useState } from "react";
import {
    collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, where, setDoc, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ReviewDoc {
    id: string;
    serverSlug: string;
    serverName: string;
    userName: string;
    rating: number;
    comment: string;
    status: "pending" | "approved";
    createdAt?: any;
}
export interface WaitlistDoc {
    id: string;
    name: string;
    email: string;
    createdAt?: any;
}
export interface SubscriberDoc {
    id: string;
    name: string | null;
    email: string;
    role: string;
    plan: string;
    xp: number;
}

export function useReviews() {
    const [reviews, setReviews] = useState<ReviewDoc[]>([]);
    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snap) => setReviews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    }, []);
    return reviews;
}

export function useWaitlist() {
    const [emails, setEmails] = useState<WaitlistDoc[]>([]);
    useEffect(() => {
        const q = query(collection(db, "waitlist"), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snap) => setEmails(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    }, []);
    return emails;
}

export function useSubscribers() {
    const [subs, setSubs] = useState<SubscriberDoc[]>([]);
    useEffect(() => {
        const q = query(collection(db, "users"), where("plan", "!=", "free"));
        return onSnapshot(q, (snap) => setSubs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    }, []);
    return subs;
}

export function useLeaderboard() {
    const [top, setTop] = useState<{ id: string; name: string | null; xp: number }[]>([]);
    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(10));
        return onSnapshot(q, (snap) => setTop(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    }, []);
    return top;
}

export async function approveReview(id: string) {
    await updateDoc(doc(db, "reviews", id), { status: "approved" });
}
export async function rejectReview(id: string) {
    await deleteDoc(doc(db, "reviews", id));
}
export async function changeUserPlan(uid: string, plan: string, role: string) {
    await updateDoc(doc(db, "users", uid), { plan, role });
}

export interface SiteSettings {
    whatsappNumber: string;
    waitlistTargetDate: string;
    waitlistCountBase: number;
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    useEffect(() => {
        return onSnapshot(doc(db, "settings", "site"), (snap) => {
            if (snap.exists()) setSettings(snap.data() as SiteSettings);
        });
    }, []);
    return settings;
}

export async function saveSiteSettings(data: SiteSettings) {
    await setDoc(doc(db, "settings", "site"), data, { merge: true });
}
