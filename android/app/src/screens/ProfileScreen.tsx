import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, ActivityIndicator } from "react-native";
import ThemedText from "../ui/ThemedText";
import { Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadToS3 } from "../utils/s3Upload";

export default function ProfileScreen({ uri, width = 300 }:{uri:string,width:number}) {
    const [, setHeight] = useState(200);
    const [uploading, setUploading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const selectImage = () => {
        launchImageLibrary({ mediaType: "photo" }, async (response) => {
            if (!response.didCancel && !response.errorCode && response.assets?.length) {
                const uri = response.assets[0].uri!;
                setImageUri(uri);
                await uploadToS3(uri,setUploading);
            }
        });
    };
    // const triggerCrash = () => {
    //     crashlytics().log("⚠️ Crash button clicked");
    //     crashlytics().crash(); // This will crash the app immediately
    // };
    const simulateCrash = () => {
        throw new Error("🔥 Simulated Crash: This is a test for Firebase Crashlytics!");
    };
    useEffect(() => {
        Image.getSize(uri, (imgWidth, imgHeight) => {
            const ratio = imgHeight / imgWidth;
            setHeight(width * ratio);
        });
    }, [uri]);
    return (
        <View style={styles.container}>
            <ThemedText>Profile Screen</ThemedText>

            <Button title="Pick and Upload Image" onPress={selectImage} />

            {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}
            <Button title="Simulate Crash" onPress={simulateCrash} />


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 12,
        resizeMode: "cover",
    },
});
