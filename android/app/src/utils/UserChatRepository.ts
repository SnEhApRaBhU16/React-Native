/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { User } from "../model/UserList";

export function subscribeToUsers(currentUserUid: string, 
    onUsersUpdate: (users: User[]) => void, 
    onError: (error: any) => void
): () => void {
    const q = query(
        collection(db, "users"),
        where("uid", "!=", currentUserUid),
        orderBy("uid")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const usersList: User[] = snapshot.docs.map((doc) => doc.data() as User);
            onUsersUpdate(usersList);
        },
        (error) => {
            onError(error);
        }
    );
}
