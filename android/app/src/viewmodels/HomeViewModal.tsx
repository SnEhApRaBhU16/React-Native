import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { setId } from "../store/slices/authSlice";
const HomeScreen: React.FC = () => {
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    return (
        <Fragment>
            <SafeAreaView
                pointerEvents={"auto"}
            >
                <View style={styles.container}>
                    <Text >HomeScreen</Text>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <Text>go to next screen</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1, padding: 20 }}>
                        <TextInput
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
