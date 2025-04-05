import {
    Button,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { setId } from "../store/slices/authSlice";
import ThemedText from "../ui/ThemedText";
import ThemedTextInput from "../ui/ThemedTextInput";
const HomeScreen: React.FC = () => {
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    return (
        <Fragment>
            <SafeAreaView
                pointerEvents={"auto"}
            >
                <View style={styles.container}>
                    <ThemedText >HomeScreen</ThemedText>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <ThemedText>go to next screen</ThemedText>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1, padding: 20 }}>
                        <ThemedTextInput
                            value={text}
                            placeholder="type here"
                            onChangeText={setText}
                        />
                    </View>
                    <Button
                        title="press"
                        onPress={() => {
                            dispatch(setId(text));
                        }}
                    />
                </View>
            </SafeAreaView>
        </Fragment>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
});
