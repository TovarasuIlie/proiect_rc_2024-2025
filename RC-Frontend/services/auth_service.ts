import { LoginForm, RegisterForm, User } from "@/models/user";
import axios from "axios";

const loginUser = async (user: LoginForm) => {
    delete axios.defaults.headers.common["Authorization"];
    const response = await axios.post<User>("http://192.168.10.2:8080/api/Authentication/login-account", user);
    return response.data;
}

const registerUser = async (user: RegisterForm) => {
    delete axios.defaults.headers.common["Authorization"];
    const response = await axios.post("http://192.168.10.2:8080/api/Authentication/register-account", user);
    return response.data
}

export { loginUser, registerUser };