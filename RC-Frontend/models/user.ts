import { Settings } from "react-native";

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    confirmPassword: string;
}

export interface User {
    email: string;
    firstname: string;
    lastname: string;
    settings: Settings;
    jwt: string;
}