import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "../store/theme-context";

const ThemedText: React.FC<TextProps> = ({ style, children, ...props }) => {
    const { theme } = useTheme(); 
    const dynamicStyle = {
        color: theme === "dark" ? "white" : "black",
        borderColor: theme === "dark" ? "#555" : "#ccc",
    };
    return (
        <Text style={[styles.defaultText, style,dynamicStyle]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        fontSize: 16, // Default font size
    },
});

export default ThemedText;
