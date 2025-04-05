import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

const ThemedText: React.FC<TextProps> = ({ style, children, ...props }) => {
    return (
        <Text style={[styles.defaultText, style]} {...props}>
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
