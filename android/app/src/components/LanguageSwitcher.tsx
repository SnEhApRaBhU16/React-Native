import React from "react";
import { View, Button, StyleSheet } from "react-native";
import i18n from "../utils/i18n";

const LanguageSwitcher: React.FC = () => {
    const changeLanguage = (lang: "en" | "hi") => {
        i18n.changeLanguage(lang);
    };

    return (
        <View style={styles.container}>
            <Button title="English" onPress={() => changeLanguage("en")} />
            <Button title="हिन्दी" onPress={() => changeLanguage("hi")} />
        </View>
    );
};

export default LanguageSwitcher;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
});
