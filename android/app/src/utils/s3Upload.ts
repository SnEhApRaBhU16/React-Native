import { Buffer } from "buffer";
import Config from "react-native-config";
import { RNS3 } from "react-native-aws3";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db,auth } from "../config/firebaseConfig"; // Your Firebase Firestore config

global.Buffer = Buffer; // for AWS SDK compatibility

const options = {
    keyPrefix: "", // optional
    bucket: "react-native-milestone",
    region: "us-east-1",
    accessKey: Config.API_ACCESS_ID||"",
    secretKey: Config.API_SECRET_KEY||"",
    acl: "public-read"
};
export const uploadToS3 = async (fileUri:string,
    setUploading:React.Dispatch<React.SetStateAction<boolean>>) => {
    setUploading(true);
    const file = {
        uri: fileUri,
        name: `${auth.currentUser.uid}-${Date.now()}.jpg`,
        type: "image/jpeg"
    };
    RNS3.put(file, options)
        .then( async (response) => {
            console.log("ress",response);
            setUploading(false);
            const imageUrl = response?.body?.postResponse?.location;
            const user = getAuth().currentUser; if (user) {
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, { profileImage: imageUrl }, { merge: true });
            }
            
        })
        .catch(error => {console.error("Upload error", error);setUploading(false);});
};
