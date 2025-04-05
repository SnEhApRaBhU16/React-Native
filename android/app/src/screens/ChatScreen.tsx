import React from "react";
import { View, StyleSheet } from "react-native";
import ThemedText from "../ui/ThemedText";

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <ThemedText>Chat Screen</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
