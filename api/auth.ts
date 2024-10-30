import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import RSAKey from "react-native-rsa";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// User login
export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  await AsyncStorage.setItem("token", response.data.token);
  await AsyncStorage.setItem("userId", response.data.userId.toString());
};

// User signup
export const signup = async (
  username: string,
  password: string,
  name: string
) => {
  console.log("hii");
  const publickey = "key"
  const response = await axios.post(`${API_URL}/signup`, {
    username,
    password,
    name,
    publickey
  });
  await AsyncStorage.setItem("token", response.data.token);
  await AsyncStorage.setItem("userId", response.data.userId.toString());
};

// Get JWT token
export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

//Get UserId
export const getUserID = async () => {
  return (await AsyncStorage.getItem("userId")) || "Unknown";
};

export const logout = async () => {
  await AsyncStorage.clear();
  router.dismissAll();
  router.navigate("/login_page");
};

