import React, { useContext } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../store/slices/auth-context";
import { useTheme } from "../store/theme-context";
import i18n from "../utils/i18n"; // Adjust path as necessary
import crashlytics from "@react-native-firebase/crashlytics";
import { useTranslation } from "react-i18next";
import ThemedText from "../ui/ThemedText";
import { logError } from "../utils/crashlytics";

const Drawer = createDrawerNavigator();

const triggerCrash = () => {
    try{
        throw new Error("Test Crash");
    }catch(e){
        logError(e);
        crashlytics().recordError(e);
    }
};

const CustomDrawerContent = (props) => {
    const {t} = useTranslation();
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

            <View style={styles.settingsContainer}>
                <ThemedText style={styles.sectionTitle}>{t("Settings")}</ThemedText>

                {/* Theme Toggle */}
                <View style={styles.settingItem}>
                    <ThemedText style={styles.settingLabel}>{t("Theme")}</ThemedText>
                    <Switch value={theme === "dark"} onValueChange={toggleTheme} />
                </View>

                {/* Language Switch */}
                <View style={styles.languageButtons}>
                    <Button title="English" onPress={() => i18n.changeLanguage("en")} />
                    <Button title="हिन्दी" onPress={() => i18n.changeLanguage("hi")} />
                </View>

                {/* Crashlytics Trigger */}
                <View style={styles.crashButton}>
                    <Button title={t("TRIGGER CRASH")} onPress={triggerCrash} color="#d9534f" />
                </View>

                {/* Logout Button */}
                <View style={styles.logoutButton}>
                    <Button title={t("LOGOUT")} onPress={logout} color="red" />
                </View>
            </View>
        </DrawerContentScrollView>
    );
};

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 12,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    settingLabel: {
        flex: 1,
        fontSize: 15,
    },
    languageButtons: {
        flexDirection: "column",
        gap: 8,
        marginBottom: 16,
    },
    crashButton: {
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 10,
    },
});
