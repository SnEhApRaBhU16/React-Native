import React, { useState } from "react";
import { Button, Image, Alert, View } from "react-native";
import { launchCamera } from "react-native-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig"; // Ensure this path matches your Firebase config location

interface CameraPickerProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CameraPicker: React.FC<CameraPickerProps> = ({ onImageCaptured }) => {
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const handleCaptureImage = () => {
        launchCamera(
            {
                mediaType: "photo",
                cameraType: "back", // You can set 'front' for the front camera
                quality: 0.5, // Adjust the quality as needed
            },
            async (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.errorCode) {
                    console.log("Error: ", response.errorCode);
                } else {
                    const source = { uri: response.assets[0].uri };
                    setPhotoUri(source.uri); // Set the selected photo URI
                    await uploadImageToFirebase(source.uri); // Upload image to Firebase
                }
            }
        );
    };

    const uploadImageToFirebase = async (uri: string) => {
        if (!uri) return;

        const fileName = uri.substring(uri.lastIndexOf("/") + 1); // Extract file name from URI
        const storageRef = ref(storage, `chat_images/${fileName}`);

        const response = await fetch(uri);
        const blob = await response.blob();

        try {
            await uploadBytes(storageRef, blob); // Upload image to Firebase Storage
            const downloadUrl = await getDownloadURL(storageRef); // Get the download URL after upload
            onImageCaptured(downloadUrl); // Pass the image URL back to the parent
            setPhotoUri(null); // Reset photo URI after sending
        } catch (error) {
            Alert.alert("Upload failed", "Failed to upload image. Please try again.");
            console.error("Upload error: ", error);
        }
    };

    return (
        <View>
            <Button title="📷" onPress={handleCaptureImage} />
            {photoUri && (
                <Image
                    source={{ uri: photoUri }}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                />
            )}
        </View>
    );
};

export default CameraPicker;
