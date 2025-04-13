import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen, { ProfileStackParamList } from "../screens/ProfileScreen";
import { useTranslation } from "react-i18next";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: t("Profile") }} />
            <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen} 
                options={{ title: t("Edit Profile") }} 
            />
        </Stack.Navigator>
    );
}
