import { ActivityIndicator, StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Lottie from "lottie-react-native";
import recordingAnimation from "../../../../assets/Animation - 1744296901944.json";
function LoadingOverlay({ message }:{message:string}) {
    return (
        <View style={styles.rootContainer}>
            <ThemedText style={styles.message}>{message}</ThemedText>
            <ActivityIndicator size="large" />
            <Lottie
                source={recordingAnimation}
                autoPlay
                loop
                style={styles.recordingAnimation}
            />
        </View>
    );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    recordingAnimation: {
        height: 375,
        width: 400,
    },
    message: {
        fontSize: 16,
        marginBottom: 12,
    },
});