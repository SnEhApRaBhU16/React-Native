import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeMain" component={WelcomeScreen} options={{ title: t("Home") }} />
        </Stack.Navigator>
    );
}
