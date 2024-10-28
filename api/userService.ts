import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';
import { logout } from './auth';

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
      if(error.status == 403){
        console.error('Error fetching users:', error);
        logout();
      }
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
      if(error.status == 403){
        console.error('Error fetching groups:', error);
        logout();
      }
      throw error;
    }
  };

  export const openAIResponse = async (
  msg: string,
  onChunk: (chunk: string) => void
) => {
  const client = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: msg }],
      stream: true,
      max_tokens:100
    });

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error("Error with OpenAI API call:", error);
  }
};
