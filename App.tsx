
import React, { useContext, useEffect, useState } from "react";
import SplashScreen from "./android/app/src/screens/SplashScreenView";
import {  StyleSheet, View } from "react-native";
import Progress from "./android/app/src/screens/Progress";
import { Navigation } from "./android/app/src/navigation/MainStackNavigator";
import axios from "axios";
import AuthContextProvider, { AuthContext } from "./android/app/src/store/slices/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./android/app/src/config/firebaseConfig";
import { ThemeProvider, useTheme } from "./android/app/src/store/theme-context";

function Root(){
    const {theme} = useTheme();
    const [isTryingLogin,setIsTryingLogin] = useState(true);
    const [isShowSplash,setIsShowSplash] = useState(true);
    const authCtx = useContext(AuthContext);
    console.log("theme", theme);

    useEffect(()=>{
        setTimeout(()=>{
            setIsShowSplash(false);
        },3800);
        async function fetchToken() {
            const storedToken =  await AsyncStorage.getItem("token");
            if(storedToken){
                authCtx.authenticate(storedToken);
            }
            setIsTryingLogin(false);
        }
        fetchToken();
   
    },[]);

    
    if(isTryingLogin || isShowSplash){
        return <View style={styles.container}>
            <SplashScreen/>
            <Progress   steps={10} height={10}  />
        </View>;
    }
    return  (     <Navigation/>);
}
function App(): React.JSX.Element {
 

    axios.interceptors.request.use(request => {
        console.log("📡 API Request:", request);
        return request;
    });
      
    axios.interceptors.response.use(response => {
        console.log("✅ API Response:", response.data,response.status);
        return response;
    });
    
   
    return (
        <>
            
            <AuthContextProvider>
                <ThemeProvider>
                    <Root/>
                </ThemeProvider>

            </AuthContextProvider>
        
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#fff",
        justifyContent:"center",
        padding:20
    },
});
export default App;
