module.exports = {
    project: {
        ios: {},
        android: {},
    },
    dependencies: {
        "react-native-vector-icons": {
            platforms: {
                ios: null, // Disable auto-linking for iOS to avoid font duplication issues
            },
        },
    },
    assets: ["./assets/fonts"], // adjust according to your path
};