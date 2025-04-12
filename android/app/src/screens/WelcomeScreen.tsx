import { Image, StyleSheet, View } from "react-native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/slices/auth-context";
import ThemedText from "../ui/ThemedText";
import { useTranslation } from "react-i18next";

function WelcomeScreen() {
    const { t } = useTranslation();
    const [fetchedMessage, setFetchedMessage] = useState("");
    const authCtx = useContext(AuthContext);
    const { token, photoUrl, displayName } = authCtx;

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await axios.get(
                    `https://authentication-43730-default-rtdb.firebaseio.com/message.json?auth=${token}`
                );
                setFetchedMessage(response.data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };

        if (token) fetchMessage();
    }, [token]);

    return (
        <View style={styles.rootContainer}>
            {photoUrl !== "" && (
                <Image source={{ uri: photoUrl }} style={styles.profileImage} />
            )}
      
            <ThemedText  style={styles.title}>{t("Welcome!")}</ThemedText>
            <ThemedText style={styles.messageText}>{t("You authenticated successfully!")}</ThemedText>

            {fetchedMessage !== "" && (
                <ThemedText style={styles.messageText}>{fetchedMessage}</ThemedText>
            )}

            {displayName !== "" && (
                <ThemedText style={styles.messageText}>{t("Name:")} {displayName}</ThemedText>
            )}
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 12,
    },
    messageText: {
        fontSize: 16,
        color: "#555",
        marginVertical: 4,
        textAlign: "center",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: "cover",
        borderWidth: 2,
        borderColor: "#6200ea",
        marginBottom: 16,
    },
});
