import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const ThemedTextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
    const { colors } = useTheme(); // Get current theme colors

    return (
        <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }, style]}
            placeholderTextColor={colors.text + "99"} // Slightly lighter placeholder
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
});

export default ThemedTextInput;
