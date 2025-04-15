import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../model/ChatTypes";
import { auth, db } from "../config/firebaseConfig";
import {
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

export const useChatViewModel = (chatId: string, selectedUserId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
    const [uploading, setUploading] = useState(false);
    const currentUser = auth.currentUser;
    const flatListRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChatMessage[];
            setMessages(msgs);
        });

        return unsubscribe;
    }, [chatId]);

    useEffect(() => {
        if (uploading) {
            setMessages((prev) => [...prev, {
                id: "",
                text: "",
                senderId: currentUser?.uid ?? "",
                receiverId: selectedUserId,
                imageUrl: "",
                isUploading: true
            }]);
        } else {
            setMessages((prev) => prev.filter((msg) => msg.id !== ""));
        }
    }, [uploading]);

    const sendMessage = async () => {
        if (!input.trim() || !currentUser) return;

        const msgRef = collection(db, "chats", chatId, "messages");

        const messageData: Partial<ChatMessage> = {
            text: input,
            senderId: currentUser.uid,
            receiverId: selectedUserId,
            timestamp: new Date().toISOString()
        };

       
        await addDoc(msgRef, messageData);
        setInput("");
    };

    const handleImageUpload = async (url: string) => {

        try {
            const msgRef = collection(db, "chats", chatId, "messages");
            await addDoc(msgRef, {
                senderId: currentUser?.uid,
                receiverId: selectedUserId,
                imageUrl: url,
                timestamp: serverTimestamp(),
                text: "",
            });

         
        } catch (err) {
            console.error("Image upload failed", err);
        }
    };

    return {
        messages,
        input,
        setInput,
        sendMessage,
        expandedMessages,
        setExpandedMessages,
        handleImageUpload,
        flatListRef,
        setUploading,
        uploading,
    };
};
