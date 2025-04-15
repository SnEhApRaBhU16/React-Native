// chat/chatRepository.ts

import { db } from "../config/firebaseConfig";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { ChatMessage } from "../model/ChatTypes";

export const listenToMessages = (
    chatId: string,
    callback: (messages: ChatMessage[]) => void
) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
        const msgs: ChatMessage[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ChatMessage[];
        callback(msgs);
    });
};

export const sendMessageToChat = async (
    chatId: string,
    message: Omit<ChatMessage, "id">
) => {
    const msgRef = collection(db, "chats", chatId, "messages");
    return await addDoc(msgRef, {
        ...message,
        timestamp: serverTimestamp(),
    });
};
