// navigation/ChatStackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UsersScreen from "../screens/UserListScreen";
import ChatScreen from "../screens/ChatScreen";
import { useTranslation } from "react-i18next";

export type ChatStackParamList = {
  UsersScreen: undefined;
  ChatScreen: {
    selectedUser: {
      uid: string;
      firstName: string;
      lastName:string
    };
    chatId: string;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator>
            <Stack.Screen name="UsersScreen" component={UsersScreen} options={{ title: t("Users") }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: t("Chat") }} />
        </Stack.Navigator>
    );
}
