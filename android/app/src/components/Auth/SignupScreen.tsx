import { useContext, useState } from "react";
import { createUser } from "../../utils/auth";
import AuthContent from "../Auth/AuthContent";
import LoadingOverlay from "../../ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../../store/slices/auth-context";

function SignupScreen() {
    const [isAuthenticating,setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthContext);
    async function signUpHandler({email, 
        password,
        phoneNumber,
        firstName,
        lastName}:
            {email:string,
            password:string,
            phoneNumber?:string,
            firstName?:string,
            lastName?:string}) {

        setIsAuthenticating(true);
        try{
            const token = await createUser(email,
                password,
                firstName,
                lastName,
                phoneNumber,
            );
            authCtx.authenticate(token);
        }catch(error){
            Alert.alert(
                "Authentication failed!",
                "Could not sign you up. Please check your input or try again later!" 
            );
            console.error(error);
        }finally{
            setIsAuthenticating(false);
        }
    }
    
    if(isAuthenticating) {
        return <LoadingOverlay message="Creating user..."/>;
    }
    return <AuthContent isLogin={false} onAuthenticate={signUpHandler}/>;
}

export default SignupScreen;