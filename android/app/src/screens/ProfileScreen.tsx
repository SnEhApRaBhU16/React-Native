import React, { useContext, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadToS3 } from "../utils/s3Upload";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import ThemedText from "../ui/ThemedText";
import { AuthContext } from "../store/slices/auth-context";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function ProfileScreen({ uri, width = 300 }: { uri: string; width: number }) {
    const [, setHeight] = useState(200);
    const {t} = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        phonenumber: "",
    });
    const authCtx = useContext(AuthContext);
    const {  displayName } = authCtx;

    const selectImage = () => {
        launchImageLibrary({ mediaType: "photo" }, async (response) => {
            if (!response.didCancel && !response.errorCode && response.assets?.length) {
                const uri = response.assets[0].uri!;
                setImageUri(uri);
                await uploadToS3(uri, setUploading);
            }
        });
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
                    setUserData({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        phonenumber: data.phoneNumber || "",
                    });
                    if (data?.profileImage) {
                        setImageUri(data.profileImage);
                    }
                }
            }
        };

        fetchProfileImage();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ThemedText  style={styles.title}>{t("Your Profile")}</ThemedText>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

            {uploading && <ActivityIndicator size="large" color="#6200ee" style={{ marginVertical: 16 }} />}

            <TouchableOpacity style={styles.button} onPress={selectImage}>
                <Text style={styles.buttonText}>{t("Pick & Upload New Image")}</Text>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <ThemedText style={styles.label}>{t("Name")}:</ThemedText>
                <ThemedText style={styles.value}>
                    {userData.firstName!==""?`${userData.firstName} ${userData.lastName}`:`${displayName}`}
                </ThemedText>

                <ThemedText style={styles.label}>{t("Phone Number:")}</ThemedText>
                <ThemedText style={styles.value}>{userData.phonenumber}</ThemedText>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 100,
        resizeMode: "cover",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#6200ee",
    },
    button: {
        backgroundColor: "#6200ee",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        marginBottom: 30,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    infoContainer: {
        width: "100%",
        paddingHorizontal: 10,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 4,
        fontSize: 16,
    },
    value: {
        marginBottom: 12,
        fontSize: 16,
    },
});
