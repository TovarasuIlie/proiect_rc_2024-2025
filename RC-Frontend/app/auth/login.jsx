import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from "yup"
import { Formik } from "formik"
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/services/auth_service'
import { useDispatch, useSelector } from "react-redux"
import { loginUserAction } from '@/redux/auth_slice'

const validationShema = Yup.object().shape({
  email :   Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password")
});

const Login = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ['login-account']
  });
  const dispatch = useDispatch()
  useSelector((state) => console.log(state));
  return (
    <SafeAreaProvider>
        <SafeAreaView>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={(values) => {
                    mutation.mutateAsync(values)
                    .then((data) => {
                      dispatch(loginUserAction(data));
                      router.push("/(tabs)");
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
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50, color: "#fff" }} 
                      placeholderTextColor={"#fff"}
                      placeholder='Email' 
                      cursorColor={"#00cc44"} 
                      keyboardType='email-address' />
                      {errors.email && touched.email && (
                        <Text className='text-red-500'>{errors.email}</Text>
                      )}
                    <TextInput 
                      value={values.password} 
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50, color: "#fff" }} 
                      placeholderTextColor={"#fff"} 
                      placeholder='Password' 
                      cursorColor={"#00cc44"} 
                      secureTextEntry={true} />
                      {errors.password && touched.password && (
                        <Text className='text-red-500'>{errors.password}</Text>
                      )}
                    <Button title="Autentifica-te" onPress={() => handleSubmit()} color={"#00cc44"}/>
                    {mutation?.isError && <Text className='p-2 px-3 text-red-800 bg-red-300 border rounded-lg font-bold mt-5'>{mutation?.error?.response?.data?.message}</Text>}
                  </View>
                )}
            </Formik>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Login

const styles = StyleSheet.create({
    textColor: {
      color: '#fff',
    }
});