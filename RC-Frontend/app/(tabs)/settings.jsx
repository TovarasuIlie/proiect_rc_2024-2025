import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from "yup"
import { Formik } from "formik"
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { setSettings, setTestingStatus } from '@/services/settings_service'
import { useState } from "react";

const validationShema = Yup.object().shape({
  desiredTemperature :    Yup.number().integer().required().min(0).label("Desired Temperature"),
  threshold:              Yup.number().integer().required().min(1).max(10).label("Threshold")
});

const Settings = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: setSettings,
    mutationKey: ['set-settings']
  });
  const [testingFan, setTestingFan] = useState(false);
  handleTestingStatus = () => {
    setTestingStatus(!testingFan);
    setTestingFan(!testingFan);
  }
  
  return (
    <SafeAreaProvider>
        <SafeAreaView>
          <Text className='text-white text-5xl my-5'>Setare Temperatura</Text>
            <Formik
                initialValues={{ desiredTemperature: 23, threshold: 1 }}
                onSubmit={(values) => {
                    mutation.mutateAsync(values)
                    .then((data) => {
                      // dispatch(loginUserAction(data));
                      // router.push("/(tabs)");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  }
                }
                validationSchema={validationShema}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                  <View className='gap-4 container'>
                    <TextInput 
                      value={values.desiredTemperature}
                      onChangeText={handleChange("desiredTemperature")}
                      onBlur={handleBlur("desiredTemperature")}
                      style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50, color: "#fff" }} 
                      placeholderTextColor={"#fff"}
                      placeholder='Desired Temperature' 
                      cursorColor={"#00cc44"}  />
                      {errors.desiredTemperature && touched.desiredTemperature && (
                        <Text className='text-red-500'>{errors.desiredTemperature}</Text>
                      )}
                    <TextInput 
                      value={values.threshold} 
                      onChangeText={handleChange("threshold")}
                      onBlur={handleBlur("threshold")}
                      style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50, color: "#fff" }} 
                      placeholderTextColor={"#fff"} 
                      placeholder='Threshold' 
                      cursorColor={"#00cc44"}  />
                      {errors.threshold && touched.threshold && (
                        <Text className='text-red-500'>{errors.password}</Text>
                      )}
                    <Button title="Salveaza" onPress={() => handleSubmit()} color={"#00cc44"}/>
                    {mutation?.isError && <Text className='p-2 px-3 text-red-800 bg-red-300 border rounded-lg font-bold mt-5'>{mutation?.error?.response?.data?.message}</Text>}
                    <Text className='text-white text-5xl my-5'>Testare Ventilator</Text>
                    <Button title={ testingFan ? "Opreste" : "Porneste" } onPress={() => handleTestingStatus()} color={ testingFan ? "#cc0000" : "#00cc44"}/>
                  </View>
                )}
            </Formik>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Settings

const styles = StyleSheet.create({
    textColor: {
      color: '#fff',
    }
});