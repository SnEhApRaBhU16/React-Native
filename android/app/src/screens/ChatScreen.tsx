/* eslint-disable @typescript-eslint/no-explicit-any */
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
    Image,
    ActivityIndicator,
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
import { CameraPicker } from "../components/CameraPicker";
import { GalleryPicker } from "../components/GalleryPicker";

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp?: string;
  imageUrl?: string;
  isUploading?: boolean;
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
    const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const currentUser = auth.currentUser;
    const flatListRef = useRef<FlatList<ChatMessage>>(null);
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);

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

    const addUploadingMessage = () => {
        const tempId = `uploading-${Date.now()}`;
        const uploadingMsg: ChatMessage = {
            id: tempId,
            text: "",
            senderId: currentUser?.uid || "",
            receiverId: selectedUser.uid,
            isUploading: true,
        };
        setMessages((prev) => [...prev, uploadingMsg]);
        return tempId;
    };
      
    const replaceUploadingMessage = (tempId: string, imageUrl: string) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === tempId
                    ? {
                        ...msg,
                        imageUrl,
                        isUploading: false,
                        timestamp: new Date().toISOString(),
                    }
                    : msg
            )
        );

    };

    const sendMessage = async () => {
        if (!input.trim() || !currentUser) return;

        const msgRef = collection(db, "chats", chatId, "messages");

        const messageData: any = {
            text: input,
            senderId: currentUser.uid,
            receiverId: selectedUser.uid,
            timestamp: serverTimestamp(),
        };

        if (imageUrl) {
            messageData.imageUrl = imageUrl;
            setImageUrl(null); 
        }

        await addDoc(msgRef, messageData);
        setInput(""); 
    };

    const handleImageUpload = async (url: string) => {
        const tempId = addUploadingMessage();

        const msgRef = collection(db, "chats", chatId, "messages");
        try {
            await addDoc(msgRef, {
                senderId: currentUser?.uid,
                receiverId: selectedUser.uid,
                imageUrl: url,
                timestamp: serverTimestamp(),
                text: "", // optional if image-only
            });
    
            replaceUploadingMessage(tempId, url); // Replace uploading message with the actual URL
        } catch (error) {
            console.error("Error uploading image:", error);
        }
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

                {item.isUploading ||item.id===""? (
                    <View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                ) : item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: 200, height: 200, marginTop: 5 }}
                    />
                ) : null}

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

    const inputContainerBg = theme === "dark" ? "#111" : "#fff"; 

    // Scroll to the bottom when messages are updated
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);
    useEffect(()=>{
        if(uploading){
            setMessages((prev)=>([...prev,{
                id: "",
                text: "",
                senderId: currentUser?.uid??"",
                receiverId: "",
                imageUrl: "",
                isUploading: true
            }]));
        }else{
            setMessages((prev)=>prev.filter((msg)=>msg.id===""))
        }
        
    },[uploading]);
    console.log("messages",messages);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={80}
        >
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 10 }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                />

                <View style={[styles.inputContainer, { backgroundColor: inputContainerBg }]}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        placeholderTextColor={"gray"}
                        onChangeText={setInput}
                        placeholder={t("Type a message")}
                        onSubmitEditing={sendMessage}
                        returnKeyType="send"
                        keyboardType="visible-password" 
                    />
                    <View style={{ flexDirection: "row" }}>
                        <CameraPicker onUploadSuccess={handleImageUpload} setUploading={setUploading} />
                        <GalleryPicker onUploadSuccess={handleImageUpload} setUploading={setUploading} />
                    </View>

                    <View style={styles.button}>
                        <Button title={t("SEND")} onPress={sendMessage} />
                    </View>
                </View>
            </View>
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
    button: {
        flex: 2,
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
        alignItems: "center",
        padding: 15,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 6,
        color: "black",
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
    },
});
