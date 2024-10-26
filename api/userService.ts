import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUsers = async () => {
  try {
    let token = await AsyncStorage.getItem('token');
    let headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`${API_URL}/users`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchGroups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${API_URL}/groups`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  };