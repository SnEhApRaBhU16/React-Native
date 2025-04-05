import { Pressable, StyleSheet, View } from "react-native";

import { Colors } from "../constants/styles";
import { ReactNode } from "react";
import ThemedText from "./ThemedText";

function Button({ children, onPress,disabled }:{children:ReactNode,onPress:()=>void,disabled?:boolean}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
            disabled={disabled||false}
        >
            <View>
                <ThemedText style={styles.buttonText}>{children}</ThemedText>
            </View>
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.primary500,
        elevation: 2,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    pressed: {
        opacity: 0.7,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
});