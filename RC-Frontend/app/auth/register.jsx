import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/services/auth_service'
import * as Yup from "yup"

const validationShema = Yup.object().shape({
  email :             Yup.string().required().email().label("Email"),
  firstname :         Yup.string().required().label("Firstname"),
  lastname :          Yup.string().required().label("Lastname"),
  password :          Yup.string().required().min(6).label("Password"),
  confirmPassword :   Yup.string().required().label("Confirm Password"),
});

const Register = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ['register-account']
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Formik
                initialValues={{ email: "", password: "", firstname: "", lastname: "", confirmPassword: "" }}
                onSubmit={(values) => {
                    mutation.mutateAsync(values)
                    .then((data) => {
                      console.log("data", data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });;
                  }
                }
                validationSchema={validationShema}
            >
              {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View className='gap-4'>
                  <TextInput
                    value={values.firstname}
                    onChangeText={handleChange("firstname")}
                    onBlur={handleBlur("firstname")} 
                    style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50 }} 
                    placeholderTextColor={"#fff"} 
                    placeholder='Firstname' 
                    cursorColor={"#00cc44"} />
                    {errors.firstname && touched.firstname && (
                        <Text className='text-red-500'>{errors.firstname}</Text>
                      )}
                  <TextInput 
                    value={values.lastname}
                    onChangeText={handleChange("lastname")}
                    onBlur={handleBlur("lastname")} 
                    style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50 }} 
                    placeholderTextColor={"#fff"} 
                    placeholder='Lastname' 
                    cursorColor={"#00cc44"} />
                    {errors.lastname && touched.lastname && (
                        <Text className='text-red-500'>{errors.lastname}</Text>
                      )}
                  <TextInput 
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")} 
                    style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50 }} 
                    placeholderTextColor={"#fff"} 
                    placeholder='Email' 
                    cursorColor={"#00cc44"} 
                    textContentType='username' />
                    {errors.email && touched.email && (
                        <Text className='text-red-500'>{errors.email}</Text>
                      )}
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}  
                    style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50 }} 
                    placeholderTextColor={"#fff"} 
                    placeholder='Password' 
                    cursorColor={"#00cc44"} 
                    secureTextEntry={true} />
                    {errors.password && touched.password && (
                        <Text className='text-red-500'>{errors.password}</Text>
                      )}
                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}  
                    style={{ borderColor: "#00cc44", borderWidth: 3, backgroundColor: "#4d4d4d", borderRadius: 5, height: 50 }} 
                    placeholderTextColor={"#fff"} 
                    placeholder='Confirm Password' 
                    cursorColor={"#00cc44"} 
                    secureTextEntry={true} />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <Text className='text-red-500'>{errors.confirmPassword}</Text>
                      )}
                  <Button title="Inregistreaza-te" onPress={() => handleSubmit()} color={"#00cc44"} />
                  {mutation?.isError && <Text className='p-2 px-3 text-red-800 bg-red-300 border rounded-lg font-bold mt-5'>{mutation?.error?.response?.data?.message}</Text>}
                </View>
              )}
            </Formik>
    </SafeAreaView>
</SafeAreaProvider>
  )
}

export default Register

const styles = StyleSheet.create({})