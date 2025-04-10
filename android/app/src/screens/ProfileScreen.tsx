import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import ThemedText from "../ui/ThemedText";
import { Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadToS3 } from "../utils/s3Upload";
import { logError } from "../utils/crashlytics";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

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
    const generateCrasherror = () => {
        try {
            throw new Error("Test crash!");
        } catch (err) {
            logError(err, "DataFetcher failed to fetch data");
        }
    };
  
    useEffect(() => {
        Image.getSize(uri, (imgWidth, imgHeight) => {
            const ratio = imgHeight / imgWidth;
            setHeight(width * ratio);
        });
    }, [uri]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data?.profileImage) {
                        setImageUri(data.profileImage);
                    }
                }
            }
        };

        fetchProfileImage();
    }, []);
    return (
        <View style={styles.container}>
            <ThemedText>Profile Screen</ThemedText>

            <Button title="Pick and Upload Image" onPress={selectImage} />

            {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

            <TouchableOpacity
                onPress={() => generateCrasherror()}
            >
                <Text >Crash</Text>
            </TouchableOpacity>
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
