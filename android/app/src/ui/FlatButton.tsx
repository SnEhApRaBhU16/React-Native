import { Pressable, StyleSheet, View } from "react-native";

import { Colors } from "../constants/styles";
import { ReactNode } from "react";
import ThemedText from "./ThemedText";

function FlatButton({ children, onPress }:{children:ReactNode,onPress:()=>void}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
        >
            <View>
                <ThemedText style={styles.buttonText}>{children}</ThemedText>
            </View>
        </Pressable>
    );
}

export default FlatButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: "center",
        color: Colors.primary100,
    },
});