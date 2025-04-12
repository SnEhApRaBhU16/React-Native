import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";

const ThemedTextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
    
    return (
        <TextInput
            style={[styles.input,style]}
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
