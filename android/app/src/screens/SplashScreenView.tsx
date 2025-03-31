import { StyleSheet, View } from "react-native";
import { Image } from "react-native";

export default function SplashScreen(){
    return(
        <View style={styles.container}>
            <View>
                <Image source={require("../assets/images/bird.jpeg")} style={styles.image}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 250,
        height: 200,
        resizeMode: "contain",
    },
});