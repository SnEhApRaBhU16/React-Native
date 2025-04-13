import React from "react";
import { Button, Alert, Platform } from "react-native";
import { launchCamera } from "react-native-image-picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { uploadToS3WithReturn } from "../utils/s3CameraUpload";
interface CameraPickerProps {
    onUploadSuccess: (url: string) => void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CameraPicker: React.FC<CameraPickerProps> = ({ onUploadSuccess, setUploading }) => {

    const handleCameraLaunch = async () => {
        let cameraPermission;
        let storagePermission;
        if (Platform.OS === "ios") {
            cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
            storagePermission = RESULTS.GRANTED;
        } else if (Platform.OS === "android") {
            cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
            storagePermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
        console.log("innnnn",cameraPermission,storagePermission);

        if (cameraPermission === RESULTS.GRANTED ) {
            launchCamera(
                {
                    mediaType: "photo",
                    cameraType: "back",
                    quality: 0.7,
                },
                async (response) => {
                    if (response.didCancel || response.errorCode || !response.assets?.length) return;

                    const asset = response.assets?.[0];
                    if (asset?.uri) {
                        try {
                            const url = await uploadToS3WithReturn(asset.uri, setUploading);
                            console.log("urllll",url);
                            if (url) {
                                onUploadSuccess(url);
                            }
                        } catch (e) {
                            Alert.alert("Upload Failed", "Could not upload the image.");
                            console.error("error camera",e);
                        }
                    }
                }
            );
        };

    };
    return <Button title="📷" onPress={handleCameraLaunch} />;


};