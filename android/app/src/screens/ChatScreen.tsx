import React from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useChatViewModel } from "../viewmodels/ChatViewModel";
import { useTheme } from "../store/theme-context";
import { useTranslation } from "react-i18next";
import { CameraPicker } from "../components/CameraPicker";
import { GalleryPicker } from "../components/GalleryPicker";
import { RouteParams } from "../model/ChatTypes";
import { ChatMessage } from "../model/ChatTypes";
import { auth } from "../config/firebaseConfig";
export default function ChatScreen() {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const { chatId, selectedUser } = route.params;
    const {
        messages,
        input,
        setInput,
        sendMessage,
        expandedMessages,
        setExpandedMessages,
        handleImageUpload,
        flatListRef,
        setUploading,
    } = useChatViewModel(chatId, selectedUser.uid);

    const { theme } = useTheme();
    const { t } = useTranslation();
    const inputContainerBg = theme === "dark" ? "#111" : "#fff";

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isSender = item.senderId === auth.currentUser?.uid;
        const isExpanded = expandedMessages[item.id] || false;
        const shouldTruncate = item.text.length > 100 && !isExpanded;

        return (
            <View style={[styles.message, isSender ? styles.sent : styles.received]}>
                <Text style={{ color: "#fff" }}>
                    {shouldTruncate ? item.text.substring(0, 100) + "..." : item.text}
                </Text>

                {item.isUploading ||item.id===""? (
                    <View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                ) : item.imageUrl ? (
                    <FastImage
                        source={{ uri: item.imageUrl }}
                        style={{ width: 200, height: 200, marginTop: 5 }}
                        resizeMode={FastImage.resizeMode.cover}
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
                    <View style={styles.iconButtons}>
                        <CameraPicker onUploadSuccess={handleImageUpload} setUploading={setUploading} />
                        <GalleryPicker onUploadSuccess={handleImageUpload} setUploading={setUploading} />
                    </View>

                    <TextInput
                        style={styles.input}
                        value={input}
                        placeholderTextColor={"gray"}
                        onChangeText={setInput}
                        placeholder={t("Type a message")}
                        onSubmitEditing={sendMessage}
                        returnKeyType="send"
                    />

                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendText}>{t("SEND")}</Text>
                    </TouchableOpacity>
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
        marginHorizontal: 5,
        paddingHorizontal: 15,
    },
    iconButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    sendText: {
        color: "#fff",
        fontWeight: "600",
    },
    readMore: {
        marginTop: 5,
        color: "#ddd",
        fontSize: 12,
        fontStyle: "italic",
    },
});
