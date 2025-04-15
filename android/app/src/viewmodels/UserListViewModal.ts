import { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { User } from "../model/UserList";
import { subscribeToUsers } from "../utils/UserChatRepository";

export function useUsersViewModel() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToUsers(
            currentUser.uid,
            (usersList) => {
                setUsers(usersList);
                setLoading(false);
            },
            (error) => {
                console.error("Firestore listener error:", error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    const getChatId = (selectedUser: User) => {
        if (!currentUser) return "";
        return currentUser.uid > selectedUser.uid
            ? currentUser.uid + selectedUser.uid
            : selectedUser.uid + currentUser.uid;
    };

    return {
        users,
        loading,
        getChatId,
        currentUser,
    };
}
