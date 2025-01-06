import { LoginForm, RegisterForm, User } from "@/models/user";
import axios from "axios";

delete axios.defaults.headers.common["Authorization"];

const loginUser = async (user: LoginForm) => {
    const response = await axios.post<User>("http://192.168.0.215:8080/api/Authentication/login-account", user);
    return response.data;
}

const registerUser = async (user: RegisterForm) => {
    const response = await axios.post("http://192.168.0.215:8080/api/Authentication/register-account", user);
    return response.data
}

export { loginUser, registerUser };