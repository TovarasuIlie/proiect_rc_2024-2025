import { Stack } from "expo-router"
import { loadUser } from "./auth_slice"
import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

const AppWrapper = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
    return (
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='auth/login'options={{ title: "Autentifica-te" }} />
          <Stack.Screen name='auth/register'options={{ title: "Inregistreza-te" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default AppWrapper;