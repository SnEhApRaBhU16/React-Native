import { View, StyleSheet, KeyboardTypeOptions } from "react-native";

import { Colors } from "../../constants/styles";
import ThemedText from "../../ui/ThemedText";
import ThemedTextInput from "../../ui/ThemedTextInput";

function Input({
    label,
    keyboardType,
    secure,
    onUpdateValue,
    value,
    isInvalid,
}:{
  label:string,
  keyboardType?:KeyboardTypeOptions,
  secure?:boolean,
  onUpdateValue:(value:string)=>void,
  value:string,
  isInvalid?:boolean
}) {
    return (
        <View style={styles.inputContainer}>
            <ThemedText style={[styles.label, isInvalid && styles.labelInvalid]}>
                {label}
            </ThemedText>
            <ThemedTextInput
                style={[styles.input, isInvalid && styles.inputInvalid]}
                autoCapitalize={"none"}
                keyboardType={keyboardType}
                secureTextEntry={secure}
                onChangeText={onUpdateValue}
                value={value}
            />
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,
    },
    label: {
        color: "black",
        marginBottom: 4,
    },
    labelInvalid: {
        color: Colors.error500,
    },
    input: {
        width: "100%",
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#cccccc",
    },
    inputInvalid: {
        backgroundColor: Colors.error100,
    },
    
});