import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


const UnauthorizedAccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>Unauthorized Access</Text>
      <Text style={styles.infoText}>You do not have permission to access this group.</Text>
      <Button title="Go Back" onPress={() => router.navigate("./user_list")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  warningText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#721c24',
  },
  infoText: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#721c24',
  },
});

export default UnauthorizedAccess;
