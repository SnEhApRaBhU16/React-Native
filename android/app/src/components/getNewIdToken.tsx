export const getNewIdToken = async (refreshToken:string) => {
    const API_KEY = "AIzaSyAN9G143Zg0FcekZjXmNYaLEVTaDfRmFxA";

    try {
        const response = await fetch(
            `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            }
        );

        const data = await response.json();
        return data.id_token;  // Return new ID token
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};
