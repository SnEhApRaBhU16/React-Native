import { Buffer } from "buffer";
import Config from "react-native-config";
import { RNS3 } from "react-native-aws3";

global.Buffer = Buffer; // for AWS SDK compatibility

const options = {
    keyPrefix: "", // optional
    bucket: "react-native-milestone",
    region: "us-east-1",
    accessKey: Config.API_ACCESS_ID||"",
    secretKey: Config.API_SECRET_KEY||"",
};
export const uploadToS3 = async (fileUri:string,
    setUploading:React.Dispatch<React.SetStateAction<boolean>>) => {
    setUploading(true);
    const file = {
        uri: fileUri,
        name: "my-image.jpg",
        type: "image/jpeg"
    };
    RNS3.put(file, options)
        .then(response => {
            setUploading(false);    
            if (response) {
                console.log("Upload success", response);
            } else {
                console.log("Upload failed", response);
            }
        })
        .catch(error => {console.error("Upload error", error);setUploading(false);});
};
