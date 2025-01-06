import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router"
import { ActivityIndicator } from "react-native";

const UnProtectRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const router = useRouter();
    useEffect(() => {
        if(user) {
            router.push("/(tabs)");
        }
    }, [user]);

    if(loading) {
        return <ActivityIndicator size={"large"} color={"#0000ff"} />
    }
    if(user)
        return null;
    return children;
}

export default UnProtectRoute;