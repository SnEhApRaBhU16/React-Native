import { Pressable, StyleSheet } from "react-native";
import AntDesign  from "react-native-vector-icons/AntDesign";

function IconButton({ icon, color, size, onPress }:{
    icon: "logout",
    color: string,
    size: number,
    onPress: () => void
}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
        >
            <AntDesign name={icon} color={color} size={size} />
        </Pressable>
    );
}

export default IconButton;

const styles = StyleSheet.create({
    button: {
        margin: 8,
        borderRadius: 20,
    },
    pressed: {
        opacity: 0.7,
    },
});