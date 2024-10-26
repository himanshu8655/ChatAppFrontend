import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { signup } from '../api/auth';
import { router } from 'expo-router';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await signup(username, password);
      router.navigate("./login_page");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default Signup;
