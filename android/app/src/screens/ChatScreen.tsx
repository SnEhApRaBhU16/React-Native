import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Button,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
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
import { useTheme } from "../store/theme-context";
import { useTranslation } from "react-i18next";
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
    console.log("sess",selectedUser,"cccc",chatId);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
    const currentUser = auth.currentUser;
    const flatListRef = useRef<FlatList<ChatMessage>>(null);
    const {theme} = useTheme();
    const {t} = useTranslation();
    useEffect(() => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChatMessage[];

            setMessages(msgs);

            // Auto-scroll to bottom when new message arrives
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
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
            timestamp: serverTimestamp(),
        });

        setInput("");
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {

        const isSender = item.senderId === currentUser?.uid;
        const isExpanded = expandedMessages[item.id] || false;
        const shouldTruncate = item.text.length > 100 && !isExpanded;

        const displayText = shouldTruncate
            ? item.text.substring(0, 100) + "..."
            : item.text;
        return (
            <View style={[styles.message, isSender ? styles.sent : styles.received]}>
                <Text style={{ color: "#fff" }}>{displayText}</Text>

                {item.text.length > 100 && (
                    <Text
                        style={styles.readMore}
                        onPress={() =>
                            setExpandedMessages((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                            }))
                        }
                    >
                        {isExpanded ? "Read less" : "Read more"}
                    </Text>
                )}
            </View>
        );
    };
    const inputContainerBg = theme === "dark" ? "#111" : "#fff"; // customize as needed
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }} 
            keyboardVerticalOffset={80} // Adjust if needed for header
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 10 }}
                        keyboardShouldPersistTaps="handled"
                    />

                    <View style={[styles.inputContainer,{backgroundColor:inputContainerBg}]}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            placeholderTextColor={"gray"}
                            onChangeText={setInput}
                            placeholder={t("Type a message")}
                            onSubmitEditing={sendMessage}
                            returnKeyType="send"
                          
                            keyboardType="visible-password" // 🔑 Key trick for Android

                        />
                        <View style={styles.button}>
                            <Button title={t("SEND")} onPress={sendMessage} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    message: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 10,
        maxWidth: "75%",
    },
    button:{
        flex:2
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
        alignItems:"center",
        padding: 15,
        borderTopWidth: 1,
        marginBottom:20,
        borderColor: "#ccc",
    },
    input: {
        flex: 6,
        color:"black",
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginRight: 5,
    },
    readMore: {
        marginTop: 5,
        color: "#ddd",
        fontSize: 12,
        fontStyle: "italic",
    }
});
