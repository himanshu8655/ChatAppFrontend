import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// User login
export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  await AsyncStorage.setItem('token', response.data.token);
  await AsyncStorage.setItem('userID',response.data.userId);
};

// User signup
export const signup = async (username: string, password: string) => {
  await axios.post(`${API_URL}/signup`, { username, password });
};

// Get JWT token
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

//Get UserId
export const getUserID = async () => {
  return await AsyncStorage.getItem('userID') || "Unknown";
};
