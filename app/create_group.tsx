import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import Checkbox from 'expo-checkbox';

interface User {
  id: string;
  username: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); 
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});
  const [groupName, setGroupName] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let token = await AsyncStorage.getItem('token');
        let headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_URL}/users`, { headers });
        const users = response.data;
        setUsers(users);
        const initialCheckedState = users.reduce(
          (acc, user) => ({ ...acc, [user.id]: false }),
          {}
        );
        setSelectedUsers(initialCheckedState);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleCheckbox = (userId: string) => {
    setSelectedUsers((prevState) => {
      const updatedState = {
        ...prevState,
        [userId]: !prevState[userId],
      };

      const allSelected = Object.values(updatedState).every((isSelected) => isSelected);
      setSelectAll(allSelected);

      return updatedState;
    });
  };

  const toggleSelectAll = () => {
    const newSelectedState = users.reduce((acc, user) => {
      acc[user.id] = !selectAll;
      return acc;
    }, {} as { [key: string]: boolean });
    setSelectedUsers(newSelectedState);
    setSelectAll(!selectAll); 
  };

  const selectedUserCount = Object.values(selectedUsers).filter(Boolean).length;

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }
    
    const selectedUserIds = Object.keys(selectedUsers).filter((id) => selectedUsers[id]);
    
    if (selectedUserIds.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    
    try {
      let token = await AsyncStorage.getItem('token');
      let headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      const payload = {
        groupName: groupName,
        userIds: selectedUserIds,
      };
      
      const response = await axios.post(`${API_URL}/groups`, payload, { headers });

      setGroupName('');
      setSelectedUsers({});
      setSelectAll(false); 

      alert("Group created successfully!");
      console.log("Group created:", response.data);
      
    } catch (error) {
      console.error('Error creating group:', error);
      alert("An error occurred while creating the group. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Create New Group</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity style={styles.createGroupButton} onPress={createGroup}>
          <Text style={styles.buttonText}>New Group</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox value={selectAll} onValueChange={toggleSelectAll} color={selectAll ? '#007BFF' : '#555'} />
          <Text style={styles.checkboxLabel}>Select All</Text>
        </View>
        <Text style={styles.infoText}>Selected Users: {selectedUserCount}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleCheckbox(item.id)} style={[styles.userItem, selectedUsers[item.id] ? { backgroundColor: '#007BFF' } : { backgroundColor: '#fff' }]}>
              <Icon name="person" size={24} color={selectedUsers[item.id] ? '#FFFFFF' : '#555'} />
              <Text style={[styles.username, { color: selectedUsers[item.id] ? '#FFFFFF' : '#333' }]}>{item.username}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createGroupButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, 
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default UserList;
  