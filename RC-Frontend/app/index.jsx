import { View, Text, StyleSheet, Button, Alert } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import UnProtectRoute from "@/route/unprotect_route"


const Home = () => {
    const router = useRouter();
    return (
        <UnProtectRoute>
            <SafeAreaProvider>
                <SafeAreaView>
                    <View>
                        <Text style={styles.textColor} className="font-bold text-5xl shadow-sm text-center mt-10 mb-10">Termofy</Text>
                        <View className="gap-4">
                            <Button title="Autentifica-te" onPress={() => router.push("/auth/login")} color={"#00cc44"}/>
                            <Button title="Inregistreaza-te" onPress={() => router.push("/auth/register")} color={"#00cc44"} />
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </UnProtectRoute>
    )
}

export default Home;

const styles = StyleSheet.create({
    textColor: {
      color: '#fff',
    }
  });