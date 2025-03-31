import AuthContent from "../Auth/AuthContent";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/MainStackNavigator";
function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    async function signInHandler({email,password}:{email:string,password:string}) {
        navigation.navigate("OTP", { email, password });

    }
    
    return <AuthContent isLogin onAuthenticate={signInHandler} />;
}

export default LoginScreen;