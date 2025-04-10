import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Button, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { auth, db } from "../config/firebaseConfig";
import {
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp?: string;
  }
  
  interface RouteParams {
    selectedUser: {
      uid: string;
      name: string;
    };
    chatId: string;
  }
  
export default function ChatScreen() {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const { selectedUser, chatId } = route.params;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const currentUser = auth.currentUser;

    useEffect(() => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as ChatMessage[];
    
            setMessages(msgs);
        });
    
        return unsubscribe;
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim() || !currentUser) return;
    
        const msgRef = collection(db, "chats", chatId, "messages");
    
        await addDoc(msgRef, {
            text: input,
            senderId: currentUser.uid,
            receiverId: selectedUser.uid,
            timestamp: serverTimestamp()
        });
    
        setInput("");
    };
    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isSender = item.senderId === currentUser?.uid;
        return (
            <View style={[styles.message, isSender ? styles.sent : styles.received]}>
                <Text style={{ color: "#fff" }}>{item.text}</Text>
            </View>
        );
    };
    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
            />
  
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    message: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 10,
        maxWidth: "75%",
    },
    sent: {
        backgroundColor: "#007AFF",
        alignSelf: "flex-end",
    },
    received: {
        backgroundColor: "#aaa",
        alignSelf: "flex-start",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 5,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginRight: 5,
    }
});
