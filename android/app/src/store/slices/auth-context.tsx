import { createContext, ReactNode, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ContextTypes {
    token:string|null,
    isAuthenticated:boolean,
    authenticate: (token:string) => void,
    logout: () => void,
    displayName:string,
    email:string,
    setUserData:(displayName:string,email:string,photoUrl:string)=>void
    photoUrl:string;
    redirectionTab: string;   
    setRedirectionTab: (tab: string) => void;
}
export const AuthContext = createContext<ContextTypes>({
    token:"",
    isAuthenticated:false,
    displayName:"",
    photoUrl:"",
    email:"",
    setUserData:()=>{},
    authenticate: () => {},
    logout: () => {},
    redirectionTab: "",
    setRedirectionTab: () => {}
});

function AuthContextProvider({children}:{children:ReactNode}) {

    
    const [authToken,setAuthToken] = useState<string|null>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [email,setEmail]= useState("");
    const [redirectionTab, setRedirectionTab] = useState("");
    
    function authenticate(token:string) {
        const userData = {
            token,
            displayName:  "",
            email: email,
            photoURL:  "",
        };
        setAuthToken(token);
        AsyncStorage.setItem("userData",JSON.stringify(userData));
    }

    function logout() {
        setAuthToken(null);
        AsyncStorage.removeItem("token");
    }
    function setUserData(displayName:string, email:string,photoUrl:string) {
        setDisplayName(displayName);
        setPhotoUrl(photoUrl);
        setEmail(email);
    }

    const value = {
        token: authToken,
        isAuthenticated: !!authToken,
        displayName: displayName,
        photoUrl: photoUrl,
        email:email,
        authenticate: authenticate,
        logout: logout,
        setUserData:setUserData,
        redirectionTab: redirectionTab,
        setRedirectionTab: setRedirectionTab
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;