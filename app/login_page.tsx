import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { login } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { Link, router } from 'expo-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.navigate("./user_list")
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text>{error}</Text> : null}
      <Link href ="/signup_page">SignUp Page</Link>
      </View>
  );
};

export default Login;
