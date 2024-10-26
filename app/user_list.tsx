import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchGroups, fetchUsers } from '@/api/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserID } from '@/api/auth';


interface User {
  id: string;
  username: string;
}

interface Group {
  groupName: string;
  members: string[];
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        const groupsData = await fetchGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserPress = async(reciepentId: string) => {
    let uid = await getUserID();
    const userId = [reciepentId, uid].sort().join('_');
    console.log(userId)
    router.navigate(`./chat_room?room_id=${userId}`);
  };

  const handleChatWithAIPress = () => {
    router.navigate(`./chat_room?room_id=AI`);
  };

  const handleNewGroupPress = () => {
    router.navigate('./create_group');
  };
  
  const grpSelected = (members: string[]) => {
    members.sort();
    router.navigate(`./chat_room?room_id=${members.join('_')}`)
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      {/* Section for Users */}
      <View style={styles.sectionContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionHeader}>Users List</Text>
          <TouchableOpacity style={styles.aiButton} onPress={handleChatWithAIPress}>
            <Icon name="smart-toy" size={24} color="white" />
            <Text style={styles.buttonText}>Chat With AI</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item.id)} style={styles.userItem}>
              <Icon name="person" size={24} color="#555" />
              <Text style={styles.username}>{item.username}</Text>
              <Icon name="chevron-right" size={24} color="#007BFF" style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* Section for Groups */}
      <View style={styles.sectionContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionHeader}>Groups List</Text>
          <TouchableOpacity style={styles.newGroupButton} onPress={handleNewGroupPress}>
            <Icon name="group-add" size={24} color="white" />
            <Text style={styles.buttonText}>Create New Group</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={groups}
          keyExtractor={(item) => item.groupName}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.groupItem} onPress={()=>{grpSelected(item.members)}}>
              <Icon name="group" size={24} color="#555" />
              <Text style={styles.groupName}>{item.groupName}</Text>
              <Icon name="chevron-right" size={24} color="#007BFF" style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  sectionContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  newGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserList;
