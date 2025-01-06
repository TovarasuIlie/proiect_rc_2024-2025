import { Settings } from "@/models/settings";
const { default: AsyncStorage } = require("@react-native-async-storage/async-storage");
import axios from "axios";


const setSettings = async (settings: Settings) => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo)
    console.log(userInfo.jwt);
    axios.defaults.headers.common["Authorization"] = "Bearer " + userInfo.jwt;
    const response = await axios.post("http://192.168.0.215:8080/api/Settings/set-settings", settings);
    userInfo.settings = response.data;
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    return response.data
}

const setTestingStatus = async (status: boolean) => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo)
    axios.defaults.headers.common["Authorization"] = "Bearer " + userInfo.jwt;
    const response = await axios.get("http://192.168.0.215:8080/api/Settings/testing-fan/" + status);
    // userInfo.settings = response.data;
    // AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    return response.data
}

export { setSettings, setTestingStatus };