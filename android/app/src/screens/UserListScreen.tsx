import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {  db,auth } from "../config/firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChatStackParamList } from "../navigation/ChatStackNavigator";

interface User {
  uid: string;
  name: string;
  email: string;
}

export default function UsersScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
    const currentUser = auth.currentUser;
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
            },
            (error) => {
                console.error(" Error in Firestore snapshot listener:", error);
            }
        );
    
        return unsubscribe;
    }, [currentUser]);
    
    console.log("uuu",users);
    const startChat = (selectedUser: User) => {
        if (!currentUser) return;

        const chatId =
      currentUser.uid > selectedUser.uid
          ? currentUser.uid + selectedUser.uid
          : selectedUser.uid + currentUser.uid;

        navigation.navigate("ChatScreen", { selectedUser, chatId });
    };

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
            <Text style={styles.userText}>{item.name || item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    userText: {
        fontSize: 16,
    },
});
