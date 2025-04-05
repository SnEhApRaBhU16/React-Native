import {  useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import ThemedText from "../ui/ThemedText";

interface StepProps {
    steps: number;
    height: number;
}




const Progress = (({steps,height}:StepProps) => {
    const [width,setWidth] = useState(0);
    const [index,setIndex] = useState(0);
    const animatedValue = useRef(new Animated.Value(-1000)).current; //  Use useRef to persist animatedValue

    useEffect (()=>{
        const interval = setInterval(()=>{
            setIndex(prev=>(prev>=10?prev:(prev+1)%(10+1)));
        },300);
        return () => clearInterval(interval);
    },[]);
    // Animate progress when width is available
    useEffect(() => {
        if (width > 0 ) {
            Animated.timing(animatedValue, {
                toValue: index>=10?0:(-width + (width * index) / steps), // Compute translation correctly
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [index,width]);
    return(
        <>
            <ThemedText style={{fontFamily:"Menlo",fontSize:12,fontWeight:"900",marginBottom:8}}>
                Loading...
            </ThemedText>
            <View 
                onLayout={e=>setWidth(e.nativeEvent.layout.width)}
                style={{height,
                    marginBottom:300,
                    backgroundColor:"rgba(0,0,0,0.1)",
                    borderRadius:height,
                    overflow:"hidden"}}>
                <Animated.View style={{
                    height,
                    borderRadius:height,
                    backgroundColor:"rgba(0, 0, 0, 0.62)",
                    width:"100%",
                    transform:[{
                        translateX:animatedValue
                    }]
                }}>

                </Animated.View>
            </View>
        </>
    );
});
// Set displayName to remove ESLint warning
export default Progress;