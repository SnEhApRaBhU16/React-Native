import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {  db,auth } from "../config/firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChatStackParamList } from "../navigation/ChatStackNavigator";
import { useTranslation } from "react-i18next";
import ThemedText from "../ui/ThemedText";
import LoadingOverlay from "../ui/LoadingOverlay";

interface User {
  uid: string;
  firstName: string;
  lastName:string;
  email: string;
}

export default function UsersScreen() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
    const currentUser = auth.currentUser;
    const [loading, setLoading] = useState<boolean>(true);

    console.log("Current User:", currentUser);
    useEffect(() => {
        if (!currentUser) {
            return;
        }
    
    
        const q = query(
            collection(db, "users"),
            where("uid", "!=", currentUser.uid),
            orderBy("uid") // Required with '!='
        );
    
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {    
                const usersList: User[] = snapshot.docs.map((doc) => doc.data() as User);
                setUsers(usersList);
                setLoading(false);
            },
            (error) => {
                console.error(" Error in Firestore snapshot listener:", error);
                setLoading(false);
            }
        );
    
        return unsubscribe;
    }, [currentUser]);
    
    const startChat = (selectedUser: User) => {
        if (!currentUser) return;

        const chatId =
      currentUser.uid > selectedUser.uid
          ? currentUser.uid + selectedUser.uid
          : selectedUser.uid + currentUser.uid;

        navigation.navigate("ChatScreen", { selectedUser, chatId });
    };

    const renderItem = ({ item }: { item: User }) => {
        const name = item.firstName+" "+ item.lastName;
        const initials = name
            ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
            : item.email[0].toUpperCase();
        return(
            <TouchableOpacity style={styles.card} onPress={() => startChat(item)}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View>
                    <Text style={styles.name}>{item.firstName+" "+item.lastName || item.email}</Text>
                </View>
            </TouchableOpacity>
        );
        
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.header}>{t("Users")}</ThemedText>
            {loading ? (
                <LoadingOverlay message="Loading users..."/>
            ) : users.length === 0 ? (
                <Text style={styles.emptyText}>No users available to chat.</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.uid}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "gray",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    avatar: {
        backgroundColor: "#6200ea",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#999",
    },
});
