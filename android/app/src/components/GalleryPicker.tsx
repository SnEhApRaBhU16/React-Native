// components/GalleryPicker.tsx
import React from "react";
import { Button, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
// import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { uploadToS3WithReturn } from "../utils/s3CameraUpload";

interface GalleryPickerProps {
  onUploadSuccess: (url: string) => void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GalleryPicker: React.FC<GalleryPickerProps> = ({ onUploadSuccess, setUploading }) => {

    const handleGalleryLaunch = async () => {
        // let storagePermission;
        // if (Platform.OS === "ios") {
        //     storagePermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        // } else if (Platform.OS === "android") {
        //     storagePermission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        // }

        launchImageLibrary(
            {
                mediaType: "photo",
                quality: 0.7,
            },
            async (response) => {
                if (response.didCancel || response.errorCode || !response.assets?.length) return;

                const asset = response.assets[0];
                if (asset.uri) {
                    try {
                        const url = await uploadToS3WithReturn(asset.uri, setUploading);
                        if (url) {
                            onUploadSuccess(url);
                        }
                    } catch (e) {
                        Alert.alert("Upload Failed", "Could not upload the image.");
                        console.error("error gallery", e);
                    }
                }
            }
        );
        
    };

    return <Button title="📸 " onPress={handleGalleryLaunch} />;
};
