import { ActivityIndicator, StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";

function LoadingOverlay({ message }:{message:string}) {
    return (
        <View style={styles.rootContainer}>
            <ThemedText style={styles.message}>{message}</ThemedText>
            <ActivityIndicator size="large" />
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
    message: {
        fontSize: 16,
        marginBottom: 12,
    },
});