import { RNS3 } from "react-native-aws3";
import Config from "react-native-config";

// Helper function to return URL from S3 upload
export const uploadToS3WithReturn = async (
    fileUri: string,
    setUploading: (val: boolean) => void
): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        setUploading(true);
        const file = {
            uri: fileUri,
            name: `${Date.now()}.jpg`,
            type: "image/jpeg",
        };
  
        const options = {
            keyPrefix: "",
            bucket: "react-native-milestone",
            region: "us-east-1",
            accessKey: Config.API_ACCESS_ID || "",
            secretKey: Config.API_SECRET_KEY || "",
            acl: "public-read",
        };
  
        RNS3.put(file, options)
            .then((response) => {
                setUploading(false);
                console.log("rrrrrrrr",response);
                if (response.status === 201) {
                    resolve(response.body.postResponse.location);
                } else {
                    reject("Upload failed");
                }
            })
            .catch((error) => {
                setUploading(false);
                reject(error);
            });
    });
};