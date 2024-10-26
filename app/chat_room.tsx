import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { getToken, getUserID } from '@/api/auth';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FilePreview from '@/components/file_preview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { openAIResponse } from '@/api/userService';
import { Animated } from 'react-native';

interface Message {
  from: string,
  message: string,
  isFile: boolean,
  room: string
}

interface ChatRouteParams {
  room_id: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;


const ChatRoom = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const route = useRoute<RouteProp<{ params: ChatRouteParams }, 'params'>>();
  const { room_id } = route.params;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | "Unknown">("Unknown");
  const [userIdTyping, setUserIdTyping] = useState<String>('');
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [typingOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (room_id === "AI") {
      return
    }
    const setupSocket = async () => {
      let uid = await getUserID()
      setUserId(uid);
      const token = await getToken();
      const newSocket: Socket = io(API_URL, {
        auth: {
          token,
        },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });
      newSocket.emit('join_room', room_id);

      newSocket.on('message', (data: Message) => {
        if (data.from != uid)
          setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on('typing', ({ userId: userId }) => {
        if (userId != uid) {
          setUserIdTyping(`${userId} is typing ...`)
          startTimer();
        }
      })

      return () => {
        newSocket.disconnect();
      };
    };

    setupSocket();
  }, [room_id]);

  const startTimer = () => {
    if (timerId) clearTimeout(timerId);

    Animated.timing(typingOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

 const id = setTimeout(() => {
    Animated.timing(typingOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setUserIdTyping(''));
    setTimerId(null);
  }, 2000);

  setTimerId(id);
  };

  const stopTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
      setUserIdTyping('')

    }
  };

  const handleAIResponse = async () => {
    const userMessage: Message = {
      from: userId,
      message: message,
      room: room_id,
      isFile: false
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    let aiResponse = "";

    const aiMessageIndex = messages.length;

    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "AI", message: "", room: room_id, isFile: false }
    ]);

    openAIResponse(message, (chunk) => {
      aiResponse += chunk;

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];

        updatedMessages[aiMessageIndex + 1] = {
          from: "AI",
          message: aiResponse,
          room: room_id,
          isFile: false
        };

        return updatedMessages;
      });
    });

    setMessage('');
  };





  const handleSendMessage = async () => {
    if (socket && message.trim() && userId) {
      const msg: Message = {
        from: userId,
        message: message,
        room: room_id,
        isFile: false
      };
      socket.emit('message', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      setMessage('');
    }
  };

  const onTyping = (text: string) => {
    setMessage(text)
    socket?.emit('typing', ({ userId: userId, roomId: room_id }));
  }

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const token = await AsyncStorage.getItem('token');
        const formData = new FormData();
        if (result.output && result.output.length > 0) {
          formData.append('file', result.output[0]);
          formData.append('name', result.output.item.name);
        }
        formData.append('content-type', 'application/octet-stream');

        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        if (userId) {

        }
        const msg: Message = {
          from: userId,
          message: response.data.fileUrl,
          room: room_id,
          isFile: true

        };
        socket?.emit('message', msg);

        setMessages((prevMessages) => [
          ...prevMessages,
          msg,
        ]);
      }
    } catch (error) {
    }
  };
  const renderMessage = ({ item }: { item: Message }) => {
    const isSentByMe = item.from === userId;

    return (
      <View style={[styles.messageContainer, isSentByMe ? styles.myMessage : styles.otherMessage]}>

        {item.isFile ? (
          <FilePreview
            from={item.from}
            message={item.message}
            fileUri={item.message}
          />
        ) : (
          <Text style={styles.messageText}>
            {isSentByMe ? `${item.message}` : `${item.message}`}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Chatting with {userId}</Text>
  
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
      />
  
      <View>
        {userIdTyping !== '' && (
          <Animated.View style={[styles.typingIndicatorContainer, { opacity: typingOpacity }]}>
            <Text style={styles.typingIndicatorText}>{userIdTyping}</Text>
          </Animated.View>
        )}
  
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            value={message}
            onChangeText={(message: string) => { onTyping(message) }}
            style={styles.input}
          />
          <Icon name="attach-file" size={24} onPress={handleFileUpload} style={styles.attachIcon} />
          <TouchableOpacity onPress={room_id == "AI" ? handleAIResponse : handleSendMessage} style={styles.sendButton}>
            <Icon name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
};

const styles = {
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
  },
  myMessage: {
    backgroundColor: '#0096c7',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ff8fab',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  typingIndicatorContainer: {
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  typingIndicatorText: {
    color: '#888',
    fontStyle: 'italic',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  attachIcon: {
    marginRight: 10,
  },
};



export default ChatRoom;
