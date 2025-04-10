// navigation/ChatStackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UsersScreen from "../screens/UserListScreen";
import ChatScreen from "../screens/ChatScreen";

export type ChatStackParamList = {
  UsersScreen: undefined;
  ChatScreen: {
    selectedUser: {
      uid: string;
      name: string;
    };
    chatId: string;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="UsersScreen" component={UsersScreen} options={{ title: "Users" }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: "Chat" }} />
        </Stack.Navigator>
    );
}
