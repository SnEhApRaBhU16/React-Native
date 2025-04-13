import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";



export default function EditProfileScreen() {
  
    const {t} = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        const fetchProfileImage = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(`${data.firstName} ${data.lastName}`);
                    setEmail(data.email);
                   
                }
            }
        };

        fetchProfileImage();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("Edit Profile")}</Text>
            <View style={styles.infoBox}>
                <Text style={styles.label}>{t("Name")}:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder={t("Enter your name")}
                />

                <Text style={styles.label}>{t("Email")}:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("Enter your email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // Add save/update logic here
                    console.log("Updated Name:", name);
                    console.log("Updated Email:", email);
                }}
            >
                <Text style={styles.buttonText}>{t("Edit Profile")}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    infoBox: {
        borderRadius: 8,
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    input: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginTop: 5,
    },
    button: {
        backgroundColor: "#6200ee",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        marginBottom: 30,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});
